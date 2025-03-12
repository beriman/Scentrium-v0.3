import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Trash2,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Notification } from "@/components/notifications/NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchNotifications();
  }, [user, navigate, activeTab, selectedFilter]);

  const fetchNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from("user_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Apply read/unread filter
      if (activeTab === "unread") {
        query = query.eq("is_read", false);
      } else if (activeTab === "read") {
        query = query.eq("is_read", true);
      }

      // Apply type filter
      if (selectedFilter) {
        query = query.ilike("type", `${selectedFilter}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notifications",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("user_id", user?.id)
        .eq("is_read", false);

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase
        .from("user_notifications")
        .delete()
        .eq("id", notificationId);

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "marketplace_order":
      case "payment_confirmed":
      case "order_shipped":
      case "payment_rejected":
        navigate(`/marketplace/orders/${notification.order_id}`);
        break;
      case "course_enrollment":
      case "course_completed":
      case "quiz_result":
        navigate(`/learning/courses/${notification.course_id}`);
        break;
      case "forum_reply":
      case "forum_mention":
      case "thread_upvote":
        navigate(`/forum/thread/${notification.thread_id}`);
        break;
      case "business_alert":
        navigate("/business/dashboard");
        break;
      default:
        // Do nothing, just mark as read
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    if (type.startsWith("marketplace")) {
      return <ShoppingBag className="h-5 w-5 text-blue-500" />;
    } else if (type.startsWith("course") || type.startsWith("quiz")) {
      return <BookOpen className="h-5 w-5 text-green-500" />;
    } else if (type.startsWith("forum")) {
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    } else if (type.startsWith("business")) {
      return <TrendingUp className="h-5 w-5 text-orange-500" />;
    } else {
      return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    if (type.startsWith("marketplace")) {
      return "Marketplace";
    } else if (type.startsWith("course") || type.startsWith("quiz")) {
      return "Learning Platform";
    } else if (type.startsWith("forum")) {
      return "Forum";
    } else if (type.startsWith("business")) {
      return "Business Tools";
    } else {
      return "Notification";
    }
  };

  const getFilterOptions = () => [
    { label: "All", value: null },
    { label: "Marketplace", value: "marketplace" },
    { label: "Learning", value: "course" },
    { label: "Forum", value: "forum" },
    { label: "Business", value: "business" },
  ];

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-800">Notifications</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getFilterOptions().map((option) => (
                <DropdownMenuItem
                  key={option.value || "all"}
                  onClick={() => setSelectedFilter(option.value)}
                  className={
                    selectedFilter === option.value ? "bg-purple-50" : ""
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={!notifications.some((n) => !n.is_read)}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Mark all as read
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {notifications.filter((n) => !n.is_read).length > 0 && (
              <Badge className="ml-2 bg-red-500">
                {notifications.filter((n) => !n.is_read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Notifications
                {selectedFilter && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    - Filtered by{" "}
                    {
                      getFilterOptions().find((o) => o.value === selectedFilter)
                        ?.label
                    }
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === "all"
                  ? "All your notifications"
                  : activeTab === "unread"
                    ? "Notifications you haven't read yet"
                    : "Notifications you've already read"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-500">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Bell className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    No {activeTab !== "all" ? activeTab : ""} notifications
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg hover:bg-gray-50 ${!notification.is_read ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {getNotificationTitle(notification.type)}
                              </p>
                              {!notification.is_read && (
                                <Badge className="bg-blue-500">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                notification.created_at,
                              ).toLocaleString()}
                            </p>
                          </div>
                          <p className="mt-1">{notification.message}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
