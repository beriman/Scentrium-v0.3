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
  BarChart3,
  Activity,
  Users,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  Calendar,
  Download,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ActivityMonitoringPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isViewActivityDialogOpen, setIsViewActivityDialogOpen] =
    useState(false);
  const { toast } = useToast();

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThreads: 0,
    newPosts: 0,
    newOrders: 0,
    courseEnrollments: 0,
  });

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [timeRange]);

  const fetchActivities = async () => {
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
          startDate = new Date(now.setHours(0, 0, 0, 0));
      }

      const { data, error } = await supabase
        .from("user_activities")
        .select("*, user:user_id(*)")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error("Error fetching activities:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to load activities. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
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
          startDate = new Date(now.setHours(0, 0, 0, 0));
      }

      // Get total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get active users in the time range
      const { count: activeUsers } = await supabase
        .from("user_activities")
        .select("user_id", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString())
        .is("is_deleted", false);

      // Get new threads in the time range
      const { count: newThreads } = await supabase
        .from("forum_threads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString())
        .is("is_deleted", false);

      // Get new posts in the time range
      const { count: newPosts } = await supabase
        .from("forum_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString())
        .is("is_deleted", false);

      // Get new orders in the time range
      const { count: newOrders } = await supabase
        .from("marketplace_orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString());

      // Get course enrollments in the time range
      const { count: courseEnrollments } = await supabase
        .from("learning_enrollments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString());

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newThreads: newThreads || 0,
        newPosts: newPosts || 0,
        newOrders: newOrders || 0,
        courseEnrollments: courseEnrollments || 0,
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsViewActivityDialogOpen(true);
  };

  // Filter activities based on search query and active tab
  const filteredActivities = activities.filter((activity) => {
    // Filter by search query
    const matchesSearch =
      activity.activity_type
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      activity.user?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      activity.details?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "forum")
      return matchesSearch && activity.module === "forum";
    if (activeTab === "marketplace")
      return matchesSearch && activity.module === "marketplace";
    if (activeTab === "learning")
      return matchesSearch && activity.module === "learning";
    if (activeTab === "profile")
      return matchesSearch && activity.module === "profile";

    return matchesSearch;
  });

  const getActivityIcon = (activity: any) => {
    const module = activity.module;
    const type = activity.activity_type;

    if (module === "forum") {
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    } else if (module === "marketplace") {
      return <ShoppingBag className="h-4 w-4 text-green-500" />;
    } else if (module === "learning") {
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    } else if (module === "profile") {
      return <Users className="h-4 w-4 text-orange-500" />;
    } else {
      return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityBadge = (activity: any) => {
    const module = activity.module;

    switch (module) {
      case "forum":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Forum
          </Badge>
        );
      case "marketplace":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Marketplace
          </Badge>
        );
      case "learning":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Learning
          </Badge>
        );
      case "profile":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Profile
          </Badge>
        );
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Activity Monitoring
          </h1>
          <p className="text-gray-500">
            Track user activities and platform usage
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Users
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.activeUsers}
                </h3>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Out of {stats.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Forum Activity
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.newThreads + stats.newPosts}
                </h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.newThreads} new threads, {stats.newPosts} new posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Marketplace</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.newOrders}
                </h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-green-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">New orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Learning</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.courseEnrollments}
                </h3>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-orange-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">New course enrollments</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search activities..."
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
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
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

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
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
                    <th className="pb-3 pl-4">User</th>
                    <th className="pb-3">Activity</th>
                    <th className="pb-3">Module</th>
                    <th className="pb-3">Details</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                              {activity.user?.username?.charAt(0) || "U"}
                            </div>
                            <span>{activity.user?.username || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {getActivityIcon(activity)}
                            <span>{activity.activity_type}</span>
                          </div>
                        </td>
                        <td className="py-4">{getActivityBadge(activity)}</td>
                        <td className="py-4 text-sm truncate max-w-xs">
                          {activity.details}
                        </td>
                        <td className="py-4 text-sm">
                          {new Date(activity.created_at).toLocaleString()}
                        </td>
                        <td className="py-4 pr-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewActivity(activity)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        No activities found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Activity Dialog */}
      <Dialog
        open={isViewActivityDialogOpen}
        onOpenChange={setIsViewActivityDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">User:</div>
                <div>{selectedActivity.user?.username || "Unknown"}</div>

                <div className="text-gray-500">Activity Type:</div>
                <div>{selectedActivity.activity_type}</div>

                <div className="text-gray-500">Module:</div>
                <div>{selectedActivity.module}</div>

                <div className="text-gray-500">Timestamp:</div>
                <div>
                  {new Date(selectedActivity.created_at).toLocaleString()}
                </div>

                <div className="text-gray-500">IP Address:</div>
                <div>{selectedActivity.ip_address || "Not recorded"}</div>

                <div className="text-gray-500">User Agent:</div>
                <div className="truncate">
                  {selectedActivity.user_agent || "Not recorded"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Details</h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p>{selectedActivity.details}</p>
                </div>
              </div>

              {selectedActivity.metadata && (
                <div className="space-y-2">
                  <h3 className="font-medium">Additional Data</h3>
                  <div className="p-4 bg-gray-50 rounded-md overflow-x-auto">
                    <pre className="text-xs">
                      {JSON.stringify(selectedActivity.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewActivityDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
