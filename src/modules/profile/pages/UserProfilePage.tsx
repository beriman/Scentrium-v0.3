import React, { useState } from "react";
import { useAuth } from "../../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  Check,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  Crown,
  Edit,
  Image,
  Shield,
} from "lucide-react";

export default function UserProfilePage() {
  const { user, profile } = useAuth();
  const [isPublic, setIsPublic] = useState(true);

  // Mock data for user profile
  const userData = {
    username: profile?.full_name || user?.email?.split("@")[0] || "User",
    bio: "Passionate fragrance enthusiast with a love for woody and oriental scents. Always exploring new perfume compositions and sharing my experiences with the community.",
    coverPhoto:
      "https://images.unsplash.com/photo-1595425964071-2c1ecb10b52d?w=1200&q=80",
    stats: {
      posts: 42,
      exp: 1250,
      level: 4,
      badges: [
        { name: "Explorer", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Contributor", icon: <MessageSquare className="h-4 w-4" /> },
        { name: "Reviewer", icon: <Star className="h-4 w-4" /> },
      ],
    },
    activities: [
      {
        type: "forum",
        title: "Posted in 'Summer Fragrance Recommendations'",
        date: "2 hours ago",
        icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
      },
      {
        type: "marketplace",
        title: "Listed 'Tom Ford Tobacco Vanille 50ml' for sale",
        date: "Yesterday",
        icon: <ShoppingBag className="h-5 w-5 text-purple-600" />,
      },
      {
        type: "learning",
        title: "Completed lesson 'Understanding Fragrance Families'",
        date: "3 days ago",
        icon: <BookOpen className="h-5 w-5 text-purple-600" />,
      },
      {
        type: "forum",
        title: "Replied to 'Best Niche Fragrances 2023'",
        date: "1 week ago",
        icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
      },
    ],
    membershipComparison: [
      {
        feature: "Forum Access",
        free: true,
        business: true,
      },
      {
        feature: "Marketplace Listings",
        free: "Limited (5/month)",
        business: "Unlimited",
      },
      {
        feature: "Daily EXP Limit",
        free: "100 EXP",
        business: "500 EXP",
      },
      {
        feature: "Learning Platform Discounts",
        free: false,
        business: "25% off",
      },
      {
        feature: "Business Tools Access",
        free: false,
        business: true,
      },
      {
        feature: "Enhanced Analytics",
        free: false,
        business: true,
      },
      {
        feature: "Two-Factor Authentication",
        free: false,
        business: true,
      },
      {
        feature: "Priority Support",
        free: false,
        business: true,
      },
    ],
  };

  // Check if user is logged in
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Please sign in to view your profile</p>
        <Link to="/login" className="text-purple-700 hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  const isBusiness = profile?.membership_type === "business";

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Cover Photo */}
      <div className="relative rounded-xl overflow-hidden mb-16 h-64">
        <img
          src={userData.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full"
        >
          <Image className="h-5 w-5" />
        </Button>
        <div className="absolute -bottom-12 left-8">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={userData.username}
            />
            <AvatarFallback>{userData.username[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{userData.username}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <Link to="/profile/edit">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </Link>
              </div>

              <Badge className={isBusiness ? "bg-purple-700" : "bg-blue-600"}>
                {isBusiness ? "Business Account" : "Free Account"}
              </Badge>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-gray-600">{userData.bio}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Stats</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xl font-bold text-purple-700">
                        {userData.stats.posts}
                      </div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xl font-bold text-purple-700">
                        {userData.stats.exp}
                      </div>
                      <div className="text-xs text-gray-500">EXP</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xl font-bold text-purple-700">
                        {userData.stats.level}
                      </div>
                      <div className="text-xs text-gray-500">Level</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.stats.badges.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-1 py-1 px-2"
                      >
                        {badge.icon}
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Privacy Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="profile-visibility">
                        Profile Visibility
                      </Label>
                      <p className="text-sm text-gray-500">
                        {isPublic
                          ? "Your profile is visible to everyone"
                          : "Only you can see your profile"}
                      </p>
                    </div>
                    <Switch
                      id="profile-visibility"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="upgrade">Upgrade Membership</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userData.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="bg-purple-100 p-2 rounded-full">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upgrade" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left py-3 px-4 border-b">
                            Feature
                          </th>
                          <th className="text-center py-3 px-4 border-b bg-blue-50">
                            Free
                          </th>
                          <th className="text-center py-3 px-4 border-b bg-purple-50">
                            Business
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.membershipComparison.map((item, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-3 px-4 font-medium">
                              {item.feature}
                            </td>
                            <td className="py-3 px-4 text-center bg-blue-50">
                              {typeof item.free === "boolean" ? (
                                item.free ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                item.free
                              )}
                            </td>
                            <td className="py-3 px-4 text-center bg-purple-50">
                              {typeof item.business === "boolean" ? (
                                item.business ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="font-medium text-purple-700">
                                  {item.business}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 bg-purple-50 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Crown className="h-8 w-8 text-purple-700" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-purple-800 mb-2">
                      Upgrade to Business Membership
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Unlock premium features, increase your daily EXP limit,
                      and get access to exclusive business tools.
                    </p>
                    <Button className="bg-purple-700 hover:bg-purple-800">
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
