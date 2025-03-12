import React, { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { useNavigate } from "react-router-dom";

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  order_id?: string;
  course_id?: string;
  thread_id?: string;
  reference_id?: string;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Set up real-time subscription for new notifications
      const notificationsSubscription = supabase
        .channel("public:user_notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "user_notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            // Add the new notification to the list
            const newNotification = payload.new as Notification;
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Show a toast notification
            toast({
              title: getNotificationTitle(newNotification.type),
              description: newNotification.message,
              duration: 5000,
            });
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsSubscription);
      };
    }
  }, [user, toast]);

  const fetchNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch notifications from the unified notifications table
      const { data, error } = await supabase
        .from("user_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.is_read).length || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
      setUnreadCount((prev) => Math.max(0, prev - 1));
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
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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
        navigate("/profile");
    }

    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    if (type.startsWith("marketplace")) {
      return <ShoppingBag className="h-4 w-4 text-blue-500" />;
    } else if (type.startsWith("course") || type.startsWith("quiz")) {
      return <BookOpen className="h-4 w-4 text-green-500" />;
    } else if (type.startsWith("forum")) {
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    } else if (type.startsWith("business")) {
      return <TrendingUp className="h-4 w-4 text-orange-500" />;
    } else {
      return <Bell className="h-4 w-4 text-gray-500" />;
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

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={markAllAsRead}
            >
              <Check className="h-3.5 w-3.5 mr-1" /> Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 p-4">
              <Bell className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.is_read ? "bg-blue-50" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">
                          {getNotificationTitle(notification.type)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            notification.created_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs w-full"
            onClick={() => navigate("/profile/notifications")}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
