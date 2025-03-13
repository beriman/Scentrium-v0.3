import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../../../supabase/auth";
import { useNavigate } from "react-router-dom";
import ExperienceBar from "@/components/gamification/ExperienceBar";
import BadgeDisplay from "@/components/gamification/BadgeDisplay";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Home,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  BarChart,
  User,
  Bell,
  Settings,
  Search,
  TrendingUp,
  Award,
  Star,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  DollarSign,
  Lightbulb,
  Calendar,
} from "lucide-react";

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const isBusinessAccount = profile?.membership_type === "business";

  // Mock data for dashboard
  const userStats = {
    level: 3,
    currentExp: 350,
    nextLevelExp: 500,
    totalPosts: 42,
    upvotes: 128,
    downvotes: 5,
    followers: 24,
    following: 36,
  };

  const recentActivities = [
    {
      id: 1,
      type: "forum",
      title: "Replied to 'Best Niche Fragrances 2023'",
      time: "2 hours ago",
      icon: <MessageSquare className="h-4 w-4 text-purple-600" />,
    },
    {
      id: 2,
      type: "marketplace",
      title: "Listed 'Woody Elegance EDP - 100ml'",
      time: "Yesterday",
      icon: <ShoppingBag className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 3,
      type: "learning",
      title: "Completed 'Understanding Fragrance Families'",
      time: "3 days ago",
      icon: <BookOpen className="h-4 w-4 text-green-600" />,
    },
  ];

  const marketplaceStats = {
    totalSales: 12,
    revenue: 2500000,
    activeListings: 5,
    pendingOrders: 2,
  };

  const learningStats = {
    enrolledCourses: 3,
    completedCourses: 1,
    currentProgress: 65,
    certificatesEarned: 1,
  };

  const businessStats = {
    monthlyRevenue: 4500000,
    monthlyExpenses: 2200000,
    profit: 2300000,
    growthRate: 12,
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Mock badges data
  const userBadges = [
    {
      id: "1",
      name: "Explorer",
      description: "Reached Level 2",
      icon: "book",
      color: "blue",
      earned: true,
    },
    {
      id: "2",
      name: "Contributor",
      description: "Created 10+ forum posts",
      icon: "message",
      color: "green",
      earned: true,
    },
    {
      id: "3",
      name: "Reviewer",
      description: "Posted 5+ fragrance reviews",
      icon: "star",
      color: "yellow",
      earned: true,
    },
    {
      id: "4",
      name: "Merchant",
      description: "Sold 5+ items",
      icon: "trending",
      color: "purple",
      earned: false,
    },
  ];

  // Daily tip
  const dailyTip = {
    title: "Fragrance Tip of the Day",
    content:
      "When testing multiple fragrances, use coffee beans between samples to reset your olfactory senses.",
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-purple-800">Scentrium</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start bg-purple-50 text-purple-700"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/forum")}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Forum
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/marketplace")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/learning")}
          >
            <BookOpen className="mr-2 h-4 w-4" /> Learning
          </Button>
          {isBusinessAccount && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/business")}
            >
              <BarChart className="mr-2 h-4 w-4" /> Business Tools
            </Button>
          )}
          <Separator className="my-4" />
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/profile")}
          >
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center w-full max-w-md">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search threads, products, courses..."
              className="w-full border-none focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <Avatar
              className="h-8 w-8 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <AvatarImage
                src={
                  profile?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                }
                alt={profile?.full_name || ""}
              />
              <AvatarFallback>
                {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile?.full_name || user.email?.split("@")[0]}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening in your Scentrium account today
            </p>
          </div>

          {/* User Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">Level</div>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                  >
                    {userStats.level === 1
                      ? "Newbie"
                      : userStats.level === 2
                        ? "Explorer"
                        : userStats.level === 3
                          ? "Enthusiast"
                          : userStats.level === 4
                            ? "Expert"
                            : "Master Perfumer"}
                  </Badge>
                </div>
                <div className="text-3xl font-bold">{userStats.level}</div>
                <ExperienceBar
                  currentExp={userStats.currentExp}
                  nextLevelExp={userStats.nextLevelExp}
                  level={userStats.level}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {userStats.currentExp}/{userStats.nextLevelExp} XP to next
                  level
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Forum Activity
                  </div>
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-3xl font-bold">{userStats.totalPosts}</div>
                <div className="text-sm text-gray-500 mt-1">Total posts</div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">{userStats.upvotes}</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-500">{userStats.downvotes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Marketplace
                  </div>
                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-3xl font-bold">
                  {marketplaceStats.activeListings}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Active listings
                </div>
                <div className="mt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pending orders:</span>
                    <span className="font-medium">
                      {marketplaceStats.pendingOrders}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-500">
                    Learning
                  </div>
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-3xl font-bold">
                  {learningStats.enrolledCourses}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Enrolled courses
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Current progress</span>
                    <span>{learningStats.currentProgress}%</span>
                  </div>
                  <Progress value={learningStats.currentProgress} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Quick Access */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                      onClick={() => navigate("/forum")}
                    >
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <span>Forum</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                      onClick={() => navigate("/marketplace")}
                    >
                      <ShoppingBag className="h-8 w-8 mb-2" />
                      <span>Marketplace</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                      onClick={() => navigate("/learning")}
                    >
                      <BookOpen className="h-8 w-8 mb-2" />
                      <span>Learning</span>
                    </Button>
                    {isBusinessAccount ? (
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
                        onClick={() => navigate("/business")}
                      >
                        <BarChart className="h-8 w-8 mb-2" />
                        <span>Business</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                        onClick={() => navigate("/profile/membership")}
                      >
                        <Crown className="h-8 w-8 mb-2" />
                        <span>Upgrade</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="bg-gray-100 p-2 rounded-full">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Marketplace Stats (if user has marketplace activity) */}
              {marketplaceStats.totalSales > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Marketplace Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-700 mb-1">
                          Total Sales
                        </div>
                        <div className="text-2xl font-bold">
                          {marketplaceStats.totalSales}
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-700 mb-1">
                          Revenue
                        </div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(marketplaceStats.revenue)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/marketplace/seller")}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" /> Manage Listings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Learning Progress (if enrolled in courses) */}
              {learningStats.enrolledCourses > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Course Progress
                          </span>
                          <span className="text-sm text-gray-500">
                            {learningStats.currentProgress}%
                          </span>
                        </div>
                        <Progress value={learningStats.currentProgress} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-sm text-green-700 mb-1">
                            Enrolled
                          </div>
                          <div className="text-2xl font-bold">
                            {learningStats.enrolledCourses}
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-sm text-purple-700 mb-1">
                            Completed
                          </div>
                          <div className="text-2xl font-bold">
                            {learningStats.completedCourses}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/learning/my-courses")}
                      >
                        <BookOpen className="mr-2 h-4 w-4" /> Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage
                        src={
                          profile?.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                        }
                        alt={profile?.full_name || ""}
                      />
                      <AvatarFallback>
                        {profile?.full_name?.[0] ||
                          user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">
                      {profile?.full_name || user.email?.split("@")[0]}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                    <Badge
                      className={`mb-4 ${isBusinessAccount ? "bg-purple-700" : "bg-blue-600"}`}
                    >
                      {isBusinessAccount ? "Business Account" : "Free Account"}
                    </Badge>

                    <div className="w-full">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Level {userStats.level} Progress</span>
                        <span>
                          {userStats.currentExp}/{userStats.nextLevelExp}
                        </span>
                      </div>
                      <Progress
                        value={
                          (userStats.currentExp / userStats.nextLevelExp) * 100
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 w-full mt-4 gap-2 text-center">
                      <div>
                        <div className="text-xl font-bold">
                          {userStats.totalPosts}
                        </div>
                        <div className="text-xs text-gray-500">Posts</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">
                          {userStats.followers}
                        </div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">
                          {userStats.following}
                        </div>
                        <div className="text-xs text-gray-500">Following</div>
                      </div>
                    </div>

                    <div className="mt-4 w-full">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/profile")}
                      >
                        <User className="mr-2 h-4 w-4" /> View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600" /> Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BadgeDisplay badges={userBadges} maxDisplay={4} />
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => navigate("/profile?tab=badges")}
                  >
                    View All Badges
                  </Button>
                </CardContent>
              </Card>

              {/* Business Stats (for business accounts) */}
              {isBusinessAccount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-orange-600" />
                      Business Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-xs text-green-700 mb-1">
                            Revenue
                          </div>
                          <div className="text-lg font-bold">
                            {formatCurrency(businessStats.monthlyRevenue)}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-blue-700 mb-1">
                            Profit
                          </div>
                          <div className="text-lg font-bold">
                            {formatCurrency(businessStats.profit)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/business/finances")}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" /> View Financial
                        Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Daily Tip */}
              <Card className="bg-purple-50 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Lightbulb className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800 mb-1">
                        {dailyTip.title}
                      </h3>
                      <p className="text-sm text-purple-700">
                        {dailyTip.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      No upcoming events at this time.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2 text-purple-700"
                      onClick={() => navigate("/forum/events")}
                    >
                      Browse community events
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Membership Upgrade (for free accounts) */}
              {!isBusinessAccount && (
                <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        <Crown className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">
                      Upgrade to Business
                    </h3>
                    <p className="text-sm text-center mb-4 text-white/80">
                      Unlock premium features, business tools, and increase your
                      daily EXP limit.
                    </p>
                    <Button
                      className="w-full bg-white hover:bg-white/90 text-purple-700"
                      onClick={() => navigate("/profile/membership")}
                    >
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
