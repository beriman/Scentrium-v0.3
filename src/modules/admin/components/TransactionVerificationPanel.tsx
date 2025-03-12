import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  ShoppingBag,
  BookOpen,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TransactionVerificationPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("marketplace");
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    const checkAdminAndLoadTransactions = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is admin
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const isUserAdmin = profileData.role === "admin";
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          setIsLoading(false);
          return;
        }

        // Fetch transactions based on active tab and status
        await fetchTransactions(activeTab, statusFilter);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transactions",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadTransactions();
  }, [user, activeTab, statusFilter, toast]);

  const fetchTransactions = async (type: string, status: string) => {
    try {
      setIsLoading(true);

      if (type === "marketplace") {
        const { data, error } = await supabase
          .from("marketplace_orders")
          .select(
            "*, buyer:buyer_id(id, full_name, email), product:product_id(*)",
          )
          .eq("status", status)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } else if (type === "learning") {
        const { data, error } = await supabase
          .from("learning_enrollments")
          .select("*, user:user_id(id, full_name, email), course:course_id(*)")
          .eq("status", status)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load transactions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionDialog(true);
  };

  const handleApproveTransaction = async (transactionId: string) => {
    setIsProcessing(true);
    try {
      if (activeTab === "marketplace") {
        // Update order status
        const { error } = await supabase
          .from("marketplace_orders")
          .update({
            status: "payment_confirmed",
            payment_status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", transactionId);

        if (error) throw error;

        // Add to order history
        const { error: historyError } = await supabase
          .from("marketplace_order_history")
          .insert({
            order_id: transactionId,
            changed_by: user?.id,
            previous_status: "pending",
            new_status: "payment_confirmed",
            notes: "Payment verified by admin",
          });

        if (historyError) throw historyError;

        // Send notification to buyer
        const { error: notifError } = await supabase
          .from("marketplace_notifications")
          .insert({
            user_id: selectedTransaction.buyer_id,
            order_id: transactionId,
            type: "payment_confirmed",
            message:
              "Your payment has been confirmed. Your order is being processed.",
          });

        if (notifError) throw notifError;
      } else if (activeTab === "learning") {
        // Update enrollment status
        const { error } = await supabase
          .from("learning_enrollments")
          .update({
            status: "approved",
            payment_status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", transactionId);

        if (error) throw error;
      }

      toast({
        title: "Transaction Approved",
        description: "The payment has been verified and approved.",
      });

      // Refresh the list
      await fetchTransactions(activeTab, statusFilter);
      setShowTransactionDialog(false);
    } catch (error: any) {
      console.error("Error approving transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve transaction",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectTransaction = async (transactionId: string) => {
    setIsProcessing(true);
    try {
      if (activeTab === "marketplace") {
        // Update order status
        const { error } = await supabase
          .from("marketplace_orders")
          .update({
            status: "cancelled",
            payment_status: "rejected",
            updated_at: new Date().toISOString(),
          })
          .eq("id", transactionId);

        if (error) throw error;

        // Add to order history
        const { error: historyError } = await supabase
          .from("marketplace_order_history")
          .insert({
            order_id: transactionId,
            changed_by: user?.id,
            previous_status: "pending",
            new_status: "cancelled",
            notes: "Payment rejected by admin",
          });

        if (historyError) throw historyError;

        // Send notification to buyer
        const { error: notifError } = await supabase
          .from("marketplace_notifications")
          .insert({
            user_id: selectedTransaction.buyer_id,
            order_id: transactionId,
            type: "payment_rejected",
            message:
              "Your payment was rejected. Please check the payment details and try again.",
          });

        if (notifError) throw notifError;
      } else if (activeTab === "learning") {
        // Update enrollment status
        const { error } = await supabase
          .from("learning_enrollments")
          .update({
            status: "rejected",
            payment_status: "rejected",
            updated_at: new Date().toISOString(),
          })
          .eq("id", transactionId);

        if (error) throw error;
      }

      toast({
        title: "Transaction Rejected",
        description: "The payment has been rejected.",
      });

      // Refresh the list
      await fetchTransactions(activeTab, statusFilter);
      setShowTransactionDialog(false);
    } catch (error: any) {
      console.error("Error rejecting transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject transaction",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Access Denied</p>
          <p className="text-gray-500">
            You don't have permission to access this page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-800 mb-1">
          Transaction Verification
        </h1>
        <p className="text-gray-600">
          Verify and approve payment transactions from marketplace and learning
          platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="marketplace">
            <ShoppingBag className="h-4 w-4 mr-2" /> Marketplace
          </TabsTrigger>
          <TabsTrigger value="learning">
            <BookOpen className="h-4 w-4 mr-2" /> Learning Platform
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 flex justify-end">
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="payment_confirmed">Approved</TabsTrigger>
              <TabsTrigger value="cancelled">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="marketplace" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Transactions</CardTitle>
              <CardDescription>
                Verify payments for marketplace orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No Pending Transactions</p>
                  <p className="text-gray-500">
                    There are no pending marketplace transactions to verify at
                    this time.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>
                            {transaction.product?.title || "Unknown Product"}
                          </TableCell>
                          <TableCell>
                            {transaction.buyer?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(transaction.total_amount)}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              transaction.created_at,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTransaction(transaction)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Platform Transactions</CardTitle>
              <CardDescription>
                Verify payments for course enrollments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No Pending Enrollments</p>
                  <p className="text-gray-500">
                    There are no pending course enrollments to verify at this
                    time.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Enrollment ID</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>
                            {transaction.course?.title || "Unknown Course"}
                          </TableCell>
                          <TableCell>
                            {transaction.user?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(transaction.payment_amount || 0)}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              transaction.created_at,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTransaction(transaction)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      <Dialog
        open={showTransactionDialog}
        onOpenChange={setShowTransactionDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Review the payment details and verify the transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="font-medium">
                    {activeTab === "marketplace"
                      ? "Marketplace Order"
                      : "Course Enrollment"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {activeTab === "marketplace" ? "Buyer" : "Student"}
                  </h3>
                  <p className="font-medium">
                    {activeTab === "marketplace"
                      ? selectedTransaction.buyer?.full_name
                      : selectedTransaction.user?.full_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {activeTab === "marketplace" ? "Product" : "Course"}
                  </h3>
                  <p className="font-medium">
                    {activeTab === "marketplace"
                      ? selectedTransaction.product?.title
                      : selectedTransaction.course?.title}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="font-medium">
                    {formatCurrency(
                      activeTab === "marketplace"
                        ? selectedTransaction.total_amount
                        : selectedTransaction.payment_amount,
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="font-medium">
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    {selectedTransaction.status.charAt(0).toUpperCase() +
                      selectedTransaction.status.slice(1).replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {/* Payment Proof Image */}
              {selectedTransaction.payment_proof && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Payment Proof
                  </h3>
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={selectedTransaction.payment_proof}
                      alt="Payment Proof"
                      className="w-full max-h-80 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {activeTab === "marketplace" && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Order Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Quantity:</div>
                    <div>{selectedTransaction.quantity}</div>
                    <div>Shipping Address:</div>
                    <div>{selectedTransaction.shipping_address}</div>
                    <div>Shipping Method:</div>
                    <div>
                      {selectedTransaction.shipping_method === "express"
                        ? "Express Shipping"
                        : "Regular Shipping"}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" /> Payment Verification
                </h3>
                <p className="text-sm text-yellow-700">
                  Please verify that the payment proof matches the transaction
                  amount and details before approving.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowTransactionDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedTransaction &&
                handleRejectTransaction(selectedTransaction.id)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Reject Payment"}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() =>
                selectedTransaction &&
                handleApproveTransaction(selectedTransaction.id)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Approve Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
