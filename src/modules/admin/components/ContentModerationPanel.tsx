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
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ContentModerationPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const checkAdminAndLoadReports = async () => {
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

        // Fetch reports based on active tab
        await fetchReports(activeTab);
      } catch (error) {
        console.error("Error loading reports:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load content reports",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadReports();
  }, [user, activeTab, toast]);

  const fetchReports = async (status: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("forum_reports")
        .select(
          "*, reporter:reporter_id(id, full_name, email), thread:thread_id(*), reply:reply_id(*)",
        )
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reports",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowReportDialog(true);
  };

  const handleApproveReport = async (
    reportId: string,
    contentType: string,
    contentId: string,
  ) => {
    setIsProcessing(true);
    try {
      // 1. Update report status
      const { error: reportError } = await supabase
        .from("forum_reports")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", reportId);

      if (reportError) throw reportError;

      // 2. Flag the content
      if (contentType === "thread") {
        const { error: threadError } = await supabase
          .from("forum_threads")
          .update({
            is_flagged: true,
            flag_reason: selectedReport.reason,
          })
          .eq("id", contentId);

        if (threadError) throw threadError;
      } else if (contentType === "reply") {
        const { error: replyError } = await supabase
          .from("forum_replies")
          .update({
            is_flagged: true,
            flag_reason: selectedReport.reason,
          })
          .eq("id", contentId);

        if (replyError) throw replyError;
      }

      // 3. Penalize the user (reduce EXP)
      // This would be implemented in a real system

      toast({
        title: "Report Approved",
        description: "The reported content has been flagged.",
      });

      // Refresh the list
      await fetchReports(activeTab);
      setShowReportDialog(false);
    } catch (error: any) {
      console.error("Error approving report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve report",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectReport = async (reportId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("forum_reports")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", reportId);

      if (error) throw error;

      toast({
        title: "Report Rejected",
        description: "The report has been marked as rejected.",
      });

      // Refresh the list
      await fetchReports(activeTab);
      setShowReportDialog(false);
    } catch (error: any) {
      console.error("Error rejecting report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject report",
      });
    } finally {
      setIsProcessing(false);
    }
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
          Content Moderation
        </h1>
        <p className="text-gray-600">
          Review and moderate reported content from the community
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {reports.length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{reports.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>
                Review and take action on reported content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No Pending Reports</p>
                  <p className="text-gray-500">
                    There are no pending reports to review at this time.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${report.thread_id ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}
                            >
                              {report.thread_id ? (
                                <>
                                  <MessageSquare className="h-3 w-3 mr-1" />{" "}
                                  Thread
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="h-3 w-3 mr-1" />{" "}
                                  Reply
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>
                            {report.reporter?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {new Date(report.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewReport(report)}
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

        <TabsContent value="approved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Approved Reports</CardTitle>
              <CardDescription>
                Reports that have been reviewed and approved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for approved reports */}
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Historical approved reports would be listed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Reports</CardTitle>
              <CardDescription>
                Reports that have been reviewed and rejected
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for rejected reports */}
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Historical rejected reports would be listed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Details Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review the reported content and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="font-medium">
                    {selectedReport.thread_id ? "Thread" : "Reply"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Reported By
                  </h3>
                  <p className="font-medium">
                    {selectedReport.reporter?.full_name || "Unknown"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Report Reason
                  </h3>
                  <p className="font-medium">{selectedReport.reason}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date Reported
                  </h3>
                  <p className="font-medium">
                    {new Date(selectedReport.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Reported Content
                </h3>
                <p className="whitespace-pre-line">
                  {selectedReport.thread_id
                    ? selectedReport.thread?.content
                    : selectedReport.reply?.content}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Moderation Actions
                </h3>
                <p className="text-sm text-yellow-700">
                  Approving this report will flag the content and may result in
                  penalties for the user who posted it.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedReport &&
                handleApproveReport(
                  selectedReport.id,
                  selectedReport.thread_id ? "thread" : "reply",
                  selectedReport.thread_id || selectedReport.reply_id,
                )
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Approve Report"}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                selectedReport && handleRejectReport(selectedReport.id)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Reject Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
