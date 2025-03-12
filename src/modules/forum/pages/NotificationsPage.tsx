import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  ThumbsUp,
  User,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";

interface Notification {
  id: string;
  type: "reply" | "mention" | "like" | "follow" | "system";
  content: string;
  created_at: string;
  is_read: boolean;
  link: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // In a real app, this would fetch from a notifications table
        // For now, we'll use mock data
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "reply",
            content: "membalas thread Anda 'Rekomendasi Parfum untuk Pemula'",
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            is_read: false,
            link: "/forum/thread/1",
            user: {
              full_name: "Budi Santoso",
              avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
            },
          },
          {
            id: "2",
            type: "like",
            content: "menyukai thread Anda 'Tips Membuat Parfum Rumahan'",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            is_read: false,
            link: "/forum/thread/2",
            user: {
              full_name: "Siti Rahayu",
              avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
            },
          },
          {
            id: "3",
            type: "mention",
            content: "menyebut Anda dalam thread 'Diskusi Aroma Woody'",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            is_read: false,
            link: "/forum/thread/3",
            user: {
              full_name: "Ahmad Hidayat",
              avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
            },
          },
          {
            id: "4",
            type: "system",
            content: "Selamat! Anda telah naik ke Level 2: Explorer",
            created_at: new Date(
              Date.now() - 1000 * 60 * 60 * 24,
            ).toISOString(), // 1 day ago
            is_read: true,
            link: "/profile",
          },
          {
            id: "5",
            type: "follow",
            content: "mulai mengikuti Anda",
            created_at: new Date(
              Date.now() - 1000 * 60 * 60 * 36,
            ).toISOString(), // 1.5 days ago
            is_read: true,
            link: "/profile/user123",
            user: {
              full_name: "Maya Wijaya",
              avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
            },
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    // In a real app, this would update the database
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = async () => {
    // In a real app, this would update the database
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, is_read: true })),
    );
  };

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.is_read)
        : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reply":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "like":
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case "mention":
        return <User className="h-5 w-5 text-purple-500" />;
      case "follow":
        return <User className="h-5 w-5 text-indigo-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs} detik yang lalu`;
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;

    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/forum" className="text-purple-700 hover:text-purple-900">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-purple-700 border-purple-200"
          >
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="unread">
            Belum Dibaca {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="reply">Balasan</TabsTrigger>
          <TabsTrigger value="mention">Mention</TabsTrigger>
          <TabsTrigger value="like">Suka</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Memuat notifikasi...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`overflow-hidden ${!notification.is_read ? "bg-purple-50 border-purple-200" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {notification.user ? (
                          <img
                            src={
                              notification.user.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.user.full_name}`
                            }
                            alt={notification.user.full_name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            {notification.user && (
                              <span className="font-medium">
                                {notification.user.full_name}{" "}
                              </span>
                            )}
                            <span className="text-gray-700">
                              {notification.content}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <Link
                            to={notification.link}
                            className="text-sm text-purple-700 hover:text-purple-900"
                          >
                            Lihat Detail
                          </Link>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 text-xs text-gray-500"
                            >
                              Tandai Dibaca
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                Tidak ada notifikasi
              </h2>
              <p className="text-gray-500">
                {activeTab === "unread"
                  ? "Anda telah membaca semua notifikasi"
                  : activeTab === "all"
                    ? "Anda belum memiliki notifikasi apapun"
                    : `Anda belum memiliki notifikasi ${activeTab}`}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
