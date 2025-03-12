import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  CreditCard,
  ShoppingBag,
  BookOpen,
  Calendar,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentVerificationPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isViewPaymentDialogOpen, setIsViewPaymentDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [timeRange, setTimeRange] = useState("week");
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, [activeTab, timeRange]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);

      // Calculate date range based on selected time range
      let startDate;
      const now = new Date();

      switch (timeRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "yesterday":
          startDate = new Date(now.setDate(now.getDate() - 1));
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7)); // Default to 1 week
      }

      // Fetch both marketplace and learning payments
      const [marketplaceResult, learningResult] = await Promise.all([
        supabase
          .from("marketplace_payments")
          .select("*, order:order_id(*), user:user_id(*)")
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: false }),

        supabase
          .from("learning_payments")
          .select(
            "*, enrollment:enrollment_id(*), user:user_id(*), course:course_id(*)",
          )
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: false }),
      ]);

      if (marketplaceResult.error) throw marketplaceResult.error;
      if (learningResult.error) throw learningResult.error;

      // Combine and format the payments
      const marketplacePayments = (marketplaceResult.data || []).map(
        (payment) => ({
          ...payment,
          type: "marketplace",
          amount: payment.order?.total_amount,
          item_name: payment.order?.items?.[0]?.product_name || "Product Order",
        }),
      );

      const learningPayments = (learningResult.data || []).map((payment) => ({
        ...payment,
        type: "learning",
        amount: payment.amount,
        item_name: payment.course?.title || "Course Enrollment",
      }));

      const allPayments = [...marketplacePayments, ...learningPayments];

      // Sort by created_at
      allPayments.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      setPayments(allPayments);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to load payments. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsViewPaymentDialogOpen(true);
  };

  const handleApprovePayment = (payment: any) => {
    setSelectedPayment(payment);
    setAdminNote("");
    setIsApproveDialogOpen(true);
  };

  const handleRejectPayment = (payment: any) => {
    setSelectedPayment(payment);
    setAdminNote("");
    setIsRejectDialogOpen(true);
  };

  const confirmApprovePayment = async () => {
    try {
      const payment = selectedPayment;
      const table =
        payment.type === "marketplace"
          ? "marketplace_payments"
          : "learning_payments";

      const { error } = await supabase
        .from(table)
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
          verified_by: "admin", // In a real app, use the actual admin ID
          admin_note: adminNote || "Payment verified by admin",
        })
        .eq("id", payment.id);

      if (error) throw error;

      // If it's a marketplace payment, update the order status
      if (payment.type === "marketplace" && payment.order_id) {
        await supabase
          .from("marketplace_orders")
          .update({
            status: "processing",
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.order_id);
      }

      // If it's a learning payment, update the enrollment status
      if (payment.type === "learning" && payment.enrollment_id) {
        await supabase
          .from("learning_enrollments")
          .update({
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.enrollment_id);
      }

      toast({
        title: "Payment Approved",
        description: "The payment has been verified successfully.",
      });

      setIsApproveDialogOpen(false);
      fetchPayments();
    } catch (error: any) {
      console.error("Error approving payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to approve payment. Please try again.",
      });
    }
  };

  const confirmRejectPayment = async () => {
    try {
      const payment = selectedPayment;
      const table =
        payment.type === "marketplace"
          ? "marketplace_payments"
          : "learning_payments";

      const { error } = await supabase
        .from(table)
        .update({
          status: "rejected",
          rejected_at: new Date().toISOString(),
          rejected_by: "admin", // In a real app, use the actual admin ID
          admin_note: adminNote || "Payment rejected by admin",
        })
        .eq("id", payment.id);

      if (error) throw error;

      // If it's a marketplace payment, update the order status
      if (payment.type === "marketplace" && payment.order_id) {
        await supabase
          .from("marketplace_orders")
          .update({
            status: "payment_failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.order_id);
      }

      // If it's a learning payment, update the enrollment status
      if (payment.type === "learning" && payment.enrollment_id) {
        await supabase
          .from("learning_enrollments")
          .update({
            status: "payment_failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.enrollment_id);
      }

      toast({
        title: "Payment Rejected",
        description: "The payment has been rejected.",
      });

      setIsRejectDialogOpen(false);
      fetchPayments();
    } catch (error: any) {
      console.error("Error rejecting payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to reject payment. Please try again.",
      });
    }
  };

  // Filter payments based on search query and active tab
  const filteredPayments = payments.filter((payment) => {
    // Filter by search query
    const matchesSearch =
      payment.payment_method
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.user?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && payment.status === "pending";
    if (activeTab === "verified")
      return matchesSearch && payment.status === "verified";
    if (activeTab === "rejected")
      return matchesSearch && payment.status === "rejected";
    if (activeTab === "marketplace")
      return matchesSearch && payment.type === "marketplace";
    if (activeTab === "learning")
      return matchesSearch && payment.type === "learning";

    return matchesSearch;
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Verified
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case "marketplace":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Marketplace
          </Badge>
        );
      case "learning":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Learning
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Verification
          </h1>
          <p className="text-gray-500">
            Verify and manage manual payments for marketplace orders and course
            enrollments
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Payments
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.filter((p) => p.status === "pending").length}
                </h3>
              </div>
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Marketplace Payments
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.filter((p) => p.type === "marketplace").length}
                </h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Learning Payments
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {payments.filter((p) => p.type === "learning").length}
                </h3>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by reference number, user, or item..."
            className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700"
          >
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Filter</span>
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "pending"
              ? "Pending Payments"
              : activeTab === "verified"
                ? "Verified Payments"
                : activeTab === "rejected"
                  ? "Rejected Payments"
                  : activeTab === "marketplace"
                    ? "Marketplace Payments"
                    : activeTab === "learning"
                      ? "Learning Payments"
                      : "All Payments"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 border-b">
                    <th className="pb-3 pl-4">Reference</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Item</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr
                        key={`${payment.type}-${payment.id}`}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-4 pl-4">
                          <div className="font-medium">
                            {payment.reference_number || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 text-sm">
                          {payment.user?.username || "Unknown"}
                        </td>
                        <td className="py-4 text-sm truncate max-w-xs">
                          {payment.item_name}
                        </td>
                        <td className="py-4 text-sm">
                          {formatCurrency(payment.amount || 0)}
                        </td>
                        <td className="py-4">
                          {getPaymentTypeBadge(payment.type)}
                        </td>
                        <td className="py-4">
                          {getPaymentStatusBadge(payment.status)}
                        </td>
                        <td className="py-4 text-sm">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleViewPayment(payment)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {payment.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleApprovePayment(payment)
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRejectPayment(payment)}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Payment
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-gray-500"
                      >
                        No payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Payment Dialog */}
      <Dialog
        open={isViewPaymentDialogOpen}
        onOpenChange={setIsViewPaymentDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-500">Reference Number:</div>
                      <div>{selectedPayment.reference_number || "N/A"}</div>

                      <div className="text-gray-500">Payment Method:</div>
                      <div>
                        {selectedPayment.payment_method || "Bank Transfer"}
                      </div>

                      <div className="text-gray-500">Amount:</div>
                      <div>{formatCurrency(selectedPayment.amount || 0)}</div>

                      <div className="text-gray-500">Status:</div>
                      <div>{getPaymentStatusBadge(selectedPayment.status)}</div>

                      <div className="text-gray-500">Date:</div>
                      <div>
                        {new Date(selectedPayment.created_at).toLocaleString()}
                      </div>

                      <div className="text-gray-500">Type:</div>
                      <div>{getPaymentTypeBadge(selectedPayment.type)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">User Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-500">Username:</div>
                      <div>{selectedPayment.user?.username || "Unknown"}</div>

                      <div className="text-gray-500">Full Name:</div>
                      <div>{selectedPayment.user?.full_name || "Unknown"}</div>

                      <div className="text-gray-500">Email:</div>
                      <div>{selectedPayment.user?.email || "Unknown"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Item Details</h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">{selectedPayment.item_name}</p>
                  {selectedPayment.type === "marketplace" &&
                    selectedPayment.order && (
                      <div className="mt-2 text-sm">
                        <p>
                          <span className="text-gray-500">Order ID:</span>{" "}
                          {selectedPayment.order_id}
                        </p>
                        <p>
                          <span className="text-gray-500">Items:</span>{" "}
                          {selectedPayment.order.items?.length || 0} items
                        </p>
                        <p>
                          <span className="text-gray-500">Total:</span>{" "}
                          {formatCurrency(
                            selectedPayment.order.total_amount || 0,
                          )}
                        </p>
                      </div>
                    )}
                  {selectedPayment.type === "learning" &&
                    selectedPayment.course && (
                      <div className="mt-2 text-sm">
                        <p>
                          <span className="text-gray-500">Course:</span>{" "}
                          {selectedPayment.course.title}
                        </p>
                        <p>
                          <span className="text-gray-500">Enrollment ID:</span>{" "}
                          {selectedPayment.enrollment_id}
                        </p>
                        <p>
                          <span className="text-gray-500">Price:</span>{" "}
                          {formatCurrency(selectedPayment.amount || 0)}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {selectedPayment.payment_proof && (
                <div>
                  <h3 className="font-medium mb-2">Payment Proof</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{selectedPayment.payment_proof}</p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Image
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment.admin_note && (
                <div>
                  <h3 className="font-medium mb-2">Admin Note</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm">{selectedPayment.admin_note}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {selectedPayment && selectedPayment.status === "pending" && (
                <>
                  <Button
                    onClick={() => {
                      setIsViewPaymentDialogOpen(false);
                      handleApprovePayment(selectedPayment);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsViewPaymentDialogOpen(false);
                      handleRejectPayment(selectedPayment);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setIsViewPaymentDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Payment Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this payment? This will mark the
              payment as verified and update the associated order or enrollment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin_note">Admin Note (Optional)</Label>
              <Textarea
                id="admin_note"
                placeholder="Add a note about this payment verification"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmApprovePayment}
            >
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Payment Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this payment? This will mark the
              payment as rejected and update the associated order or enrollment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin_note">Rejection Reason (Required)</Label>
              <Textarea
                id="admin_note"
                placeholder="Explain why this payment is being rejected"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejectPayment}
              disabled={!adminNote}
            >
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
