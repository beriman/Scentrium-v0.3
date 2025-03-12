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
  Flag,
  MessageSquare,
  AlertTriangle,
  Lock,
  Unlock,
  Pin,
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

export default function ForumModerationPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isViewThreadDialogOpen, setIsViewThreadDialogOpen] = useState(false);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [moderationNote, setModerationNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    } else {
      fetchThreads();
    }
  }, [activeTab]);

  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("forum_threads")
        .select("*, user:user_id(*), category:category_id(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error: any) {
      console.error("Error fetching threads:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to load threads. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("forum_reports")
        .select(
          "*, reporter:reporter_id(*), thread:thread_id(*), post:post_id(*)",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to load reports. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewThread = (thread: any) => {
    setSelectedThread(thread);
    setIsViewThreadDialogOpen(true);
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsViewReportDialogOpen(true);
  };

  const handleDeleteThread = (thread: any) => {
    setSelectedThread(thread);
    setModerationNote("");
    setIsDeleteDialogOpen(true);
  };

  const handleApproveThread = async (thread: any) => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({
          is_approved: true,
          moderation_note: "Approved by moderator",
          updated_at: new Date().toISOString(),
        })
        .eq("id", thread.id);

      if (error) throw error;

      toast({
        title: "Thread Approved",
        description:
          "The thread has been approved and is now visible to users.",
      });

      fetchThreads();
    } catch (error: any) {
      console.error("Error approving thread:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to approve thread. Please try again.",
      });
    }
  };

  const confirmDeleteThread = async () => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({
          is_deleted: true,
          moderation_note: moderationNote || "Deleted by moderator",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedThread.id);

      if (error) throw error;

      toast({
        title: "Thread Deleted",
        description: "The thread has been deleted successfully.",
      });

      setIsDeleteDialogOpen(false);
      fetchThreads();
    } catch (error: any) {
      console.error("Error deleting thread:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to delete thread. Please try again.",
      });
    }
  };

  const handleToggleLockThread = async (thread: any) => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({
          is_locked: !thread.is_locked,
          moderation_note: thread.is_locked
            ? "Thread unlocked by moderator"
            : "Thread locked by moderator",
          updated_at: new Date().toISOString(),
        })
        .eq("id", thread.id);

      if (error) throw error;

      toast({
        title: thread.is_locked ? "Thread Unlocked" : "Thread Locked",
        description: thread.is_locked
          ? "The thread has been unlocked and users can now reply."
          : "The thread has been locked and users cannot reply anymore.",
      });

      fetchThreads();
    } catch (error: any) {
      console.error("Error toggling thread lock:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update thread. Please try again.",
      });
    }
  };

  const handleTogglePinThread = async (thread: any) => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({
          is_pinned: !thread.is_pinned,
          moderation_note: thread.is_pinned
            ? "Thread unpinned by moderator"
            : "Thread pinned by moderator",
          updated_at: new Date().toISOString(),
        })
        .eq("id", thread.id);

      if (error) throw error;

      toast({
        title: thread.is_pinned ? "Thread Unpinned" : "Thread Pinned",
        description: thread.is_pinned
          ? "The thread has been unpinned."
          : "The thread has been pinned to the top of the category.",
      });

      fetchThreads();
    } catch (error: any) {
      console.error("Error toggling thread pin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update thread. Please try again.",
      });
    }
  };

  const handleResolveReport = async (report: any) => {
    try {
      const { error } = await supabase
        .from("forum_reports")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: "admin", // In a real app, use the actual admin ID
          resolution_note: "Report reviewed and resolved by moderator",
        })
        .eq("id", report.id);

      if (error) throw error;

      toast({
        title: "Report Resolved",
        description: "The report has been marked as resolved.",
      });

      fetchReports();
    } catch (error: any) {
      console.error("Error resolving report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to resolve report. Please try again.",
      });
    }
  };

  // Filter threads based on search query and active tab
  const filteredThreads = threads.filter((thread) => {
    // Filter by search query
    const matchesSearch =
      thread.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.user?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      thread.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch && !thread.is_deleted;
    if (activeTab === "pending")
      return matchesSearch && !thread.is_approved && !thread.is_deleted;
    if (activeTab === "approved")
      return matchesSearch && thread.is_approved && !thread.is_deleted;
    if (activeTab === "locked")
      return matchesSearch && thread.is_locked && !thread.is_deleted;
    if (activeTab === "pinned")
      return matchesSearch && thread.is_pinned && !thread.is_deleted;

    return matchesSearch && !thread.is_deleted;
  });

  // Filter reports based on search query
  const filteredReports = reports.filter((report) => {
    // Filter by search query
    const matchesSearch =
      report.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.thread?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    if (activeTab === "reports-pending")
      return matchesSearch && report.status === "pending";
    if (activeTab === "reports-resolved")
      return matchesSearch && report.status === "resolved";

    return matchesSearch;
  });

  const getThreadStatusBadge = (thread: any) => {
    if (thread.is_deleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (!thread.is_approved) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pending
        </Badge>
      );
    }
    if (thread.is_locked) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Locked
        </Badge>
      );
    }
    if (thread.is_pinned) {
      return <Badge className="bg-blue-500">Pinned</Badge>;
    }
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        Approved
      </Badge>
    );
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Resolved
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Forum Moderation</h1>
        <p className="text-gray-500">
          Manage forum threads, posts, and user reports
        </p>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search threads or reports..."
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
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
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

      {/* Threads Table */}
      {activeTab !== "reports" ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "pending"
                ? "Pending Threads"
                : activeTab === "approved"
                  ? "Approved Threads"
                  : activeTab === "locked"
                    ? "Locked Threads"
                    : activeTab === "pinned"
                      ? "Pinned Threads"
                      : "All Threads"}
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
                      <th className="pb-3 pl-4">Title</th>
                      <th className="pb-3">Author</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Created</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredThreads.length > 0 ? (
                      filteredThreads.map((thread) => (
                        <tr
                          key={thread.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-4 pl-4">
                            <div className="font-medium truncate max-w-xs">
                              {thread.title}
                            </div>
                          </td>
                          <td className="py-4 text-sm">
                            {thread.user?.username || "Unknown"}
                          </td>
                          <td className="py-4 text-sm">
                            {thread.category?.name || "Uncategorized"}
                          </td>
                          <td className="py-4 text-sm">
                            {new Date(thread.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            {getThreadStatusBadge(thread)}
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
                                  onClick={() => handleViewThread(thread)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Thread
                                </DropdownMenuItem>
                                {!thread.is_approved && (
                                  <DropdownMenuItem
                                    onClick={() => handleApproveThread(thread)}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Thread
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleToggleLockThread(thread)}
                                >
                                  {thread.is_locked ? (
                                    <>
                                      <Unlock className="mr-2 h-4 w-4" />
                                      Unlock Thread
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="mr-2 h-4 w-4" />
                                      Lock Thread
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleTogglePinThread(thread)}
                                >
                                  {thread.is_pinned ? (
                                    <>
                                      <Pin className="mr-2 h-4 w-4" />
                                      Unpin Thread
                                    </>
                                  ) : (
                                    <>
                                      <Pin className="mr-2 h-4 w-4" />
                                      Pin Thread
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteThread(thread)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Delete Thread
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-gray-500"
                        >
                          No threads found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Reports Table */
        <Card>
          <CardHeader>
            <CardTitle>User Reports</CardTitle>
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
                      <th className="pb-3 pl-4">Reported Content</th>
                      <th className="pb-3">Reporter</th>
                      <th className="pb-3">Reason</th>
                      <th className="pb-3">Reported At</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-4 pl-4">
                            <div className="font-medium truncate max-w-xs">
                              {report.thread
                                ? report.thread.title
                                : report.post
                                  ? "Post in thread"
                                  : "Unknown content"}
                            </div>
                          </td>
                          <td className="py-4 text-sm">
                            {report.reporter?.username || "Unknown"}
                          </td>
                          <td className="py-4 text-sm truncate max-w-xs">
                            {report.reason}
                          </td>
                          <td className="py-4 text-sm">
                            {new Date(report.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            {getReportStatusBadge(report.status)}
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
                                  onClick={() => handleViewReport(report)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Report
                                </DropdownMenuItem>
                                {report.status === "pending" && (
                                  <DropdownMenuItem
                                    onClick={() => handleResolveReport(report)}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Resolved
                                  </DropdownMenuItem>
                                )}
                                {report.thread && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleViewThread(report.thread)
                                    }
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    View Thread
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-gray-500"
                        >
                          No reports found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Thread Dialog */}
      <Dialog
        open={isViewThreadDialogOpen}
        onOpenChange={setIsViewThreadDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Thread Details</DialogTitle>
          </DialogHeader>
          {selectedThread && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">
                    {selectedThread.title}
                  </h3>
                  {getThreadStatusBadge(selectedThread)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>
                    Posted by {selectedThread.user?.username || "Unknown"}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(selectedThread.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedThread.content }}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Thread Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Category:</div>
                  <div>{selectedThread.category?.name || "Uncategorized"}</div>

                  <div className="text-gray-500">Views:</div>
                  <div>{selectedThread.view_count || 0}</div>

                  <div className="text-gray-500">Replies:</div>
                  <div>{selectedThread.reply_count || 0}</div>

                  <div className="text-gray-500">Status:</div>
                  <div>
                    {!selectedThread.is_approved
                      ? "Pending Approval"
                      : selectedThread.is_deleted
                        ? "Deleted"
                        : selectedThread.is_locked
                          ? "Locked"
                          : "Active"}
                  </div>

                  {selectedThread.moderation_note && (
                    <>
                      <div className="text-gray-500">Moderation Note:</div>
                      <div>{selectedThread.moderation_note}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {selectedThread && !selectedThread.is_approved && (
                <Button
                  onClick={() => {
                    handleApproveThread(selectedThread);
                    setIsViewThreadDialogOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve
                </Button>
              )}
              {selectedThread && (
                <Button
                  onClick={() => {
                    handleToggleLockThread(selectedThread);
                    setIsViewThreadDialogOpen(false);
                  }}
                  variant="outline"
                >
                  {selectedThread.is_locked ? (
                    <>
                      <Unlock className="mr-2 h-4 w-4" /> Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" /> Lock
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsViewThreadDialogOpen(false)}
              >
                Close
              </Button>
              {selectedThread && !selectedThread.is_deleted && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewThreadDialogOpen(false);
                    handleDeleteThread(selectedThread);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Delete
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog
        open={isViewReportDialogOpen}
        onOpenChange={setIsViewReportDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium">Reported Content</h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">
                    {selectedReport.thread
                      ? selectedReport.thread.title
                      : selectedReport.post
                        ? "Post in thread"
                        : "Unknown content"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Report Reason</h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p>{selectedReport.reason}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Report Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Reported By:</div>
                  <div>{selectedReport.reporter?.username || "Unknown"}</div>

                  <div className="text-gray-500">Reported At:</div>
                  <div>
                    {new Date(selectedReport.created_at).toLocaleString()}
                  </div>

                  <div className="text-gray-500">Status:</div>
                  <div>
                    {selectedReport.status === "resolved"
                      ? "Resolved"
                      : "Pending"}
                  </div>

                  {selectedReport.status === "resolved" && (
                    <>
                      <div className="text-gray-500">Resolved At:</div>
                      <div>
                        {new Date(selectedReport.resolved_at).toLocaleString()}
                      </div>

                      <div className="text-gray-500">Resolution Note:</div>
                      <div>{selectedReport.resolution_note}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewReportDialogOpen(false)}
            >
              Close
            </Button>
            {selectedReport && selectedReport.status === "pending" && (
              <Button
                onClick={() => {
                  handleResolveReport(selectedReport);
                  setIsViewReportDialogOpen(false);
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Thread Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Thread</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this thread? This action can be
              reversed by an admin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="moderation_note">
                Moderation Note (Optional)
              </Label>
              <Textarea
                id="moderation_note"
                placeholder="Add a note explaining why this thread is being deleted"
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteThread}>
              Delete Thread
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
