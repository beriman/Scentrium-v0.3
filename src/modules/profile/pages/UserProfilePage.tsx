import React, { useState, useEffect } from "react";
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
  Star,
  Award,
  Bell,
  UserPlus,
  UserMinus,
} from "lucide-react";
import ExperienceBar from "@/components/gamification/ExperienceBar";
import BadgeDisplay from "@/components/gamification/BadgeDisplay";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import ExpGainToast from "@/components/gamification/ExpGainToast";
import { useToast } from "@/components/ui/use-toast";

export default function UserProfilePage() {
  const { user, profile } = useAuth();
  const [isPublic, setIsPublic] = useState(true);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showExpGainToast, setShowExpGainToast] = useState(false);
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

  // For demo purposes, show level up modal after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLevelUpModal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for user profile
  const userData = {
    username: profile?.full_name || user?.email?.split("@")[0] || "User",
    bio: "Passionate fragrance enthusiast with a love for woody and oriental scents. Always exploring new perfume compositions and sharing my experiences with the community.",
    coverPhoto:
      "https://images.unsplash.com/photo-1595425964071-2c1ecb10b52d?w=1200&q=80",
    stats: {
      posts: 42,
      exp: 1250,
      nextLevelExp: 2000,
      level: 4,
      followers: 28,
      following: 35,
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

  // Mock badges data
  const userBadges = [
    {
      id: "1",
      name: "Explorer",
      description: "Reached Level 2 and explored all sections of the platform",
      icon: "book",
      color: "blue",
      earned: true,
      earnedDate: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Contributor",
      description: "Created 10+ forum posts that received upvotes",
      icon: "message",
      color: "green",
      earned: true,
      earnedDate: "2023-06-20T14:45:00Z",
    },
    {
      id: "3",
      name: "Reviewer",
      description: "Posted 5+ detailed fragrance reviews",
      icon: "star",
      color: "yellow",
      earned: true,
      earnedDate: "2023-07-05T09:15:00Z",
    },
    {
      id: "4",
      name: "Merchant",
      description: "Sold 5+ items in the marketplace",
      icon: "trending",
      color: "purple",
      earned: true,
      earnedDate: "2023-08-12T16:30:00Z",
    },
    {
      id: "5",
      name: "Scholar",
      description: "Completed 3+ learning courses",
      icon: "award",
      color: "indigo",
      earned: false,
    },
    {
      id: "6",
      name: "Perfumer",
      description: "Shared an original perfume formula",
      icon: "crown",
      color: "pink",
      earned: false,
    },
    {
      id: "7",
      name: "Moderator",
      description: "Helped moderate the community",
      icon: "shield",
      color: "red",
      earned: false,
    },
  ];

  // New badges for level up modal
  const newBadges = [
    {
      id: "8",
      name: "Expert",
      description: "Reached Level 4 and demonstrated expertise",
      icon: "crown",
      color: "purple",
      earned: true,
      earnedDate: new Date().toISOString(),
    },
  ];

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

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You are no longer following ${userData.username}`
        : `You are now following ${userData.username}`,
    });

    if (!isFollowing) {
      // Show EXP gain toast when following someone
      setShowExpGainToast(true);
      setTimeout(() => setShowExpGainToast(false), 3000);
    }
  };

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
                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={handleFollowToggle}
                    className={
                      isFollowing
                        ? "border-red-200 text-red-700"
                        : "bg-purple-700 hover:bg-purple-800"
                    }
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" /> Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" /> Follow
                      </>
                    )}
                  </Button>
                  <Link to="/profile/edit">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={isBusiness ? "bg-purple-700" : "bg-blue-600"}>
                  {isBusiness ? "Business Account" : "Free Account"}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-800 border-yellow-200"
                >
                  <Award className="mr-1 h-3 w-3" /> Level{" "}
                  {userData.stats.level}: Expert
                </Badge>
              </div>

              <ExperienceBar
                currentExp={userData.stats.exp}
                nextLevelExp={userData.stats.nextLevelExp}
                level={userData.stats.level}
                className="mb-4"
              />

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-gray-600">{userData.bio}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Stats</h3>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-700">
                        {userData.stats.posts}
                      </div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-700">
                        {userData.stats.exp}
                      </div>
                      <div className="text-xs text-gray-500">EXP</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-700">
                        {userData.stats.followers}
                      </div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-700">
                        {userData.stats.following}
                      </div>
                      <div className="text-xs text-gray-500">Following</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Badges</h3>
                  <BadgeDisplay badges={userBadges} maxDisplay={4} />
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
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

            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Earned Badges</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userBadges
                          .filter((badge) => badge.earned)
                          .map((badge) => (
                            <div
                              key={badge.id}
                              className="flex items-start gap-3 p-3 border rounded-md"
                            >
                              <div
                                className={`p-2 rounded-full bg-${badge.color}-100`}
                              >
                                {badge.icon === "book" && (
                                  <BookOpen
                                    className={`h-5 w-5 text-${badge.color}-600`}
                                  />
                                )}
                                {badge.icon === "message" && (
                                  <MessageSquare
                                    className={`h-5 w-5 text-${badge.color}-600`}
                                  />
                                )}
                                {badge.icon === "star" && (
                                  <Star
                                    className={`h-5 w-5 text-${badge.color}-600`}
                                  />
                                )}
                                {badge.icon === "trending" && (
                                  <ShoppingBag
                                    className={`h-5 w-5 text-${badge.color}-600`}
                                  />
                                )}
                                {badge.icon === "award" && (
                                  <Award
                                    className={`h-5 w-5 text-${badge.color}-600`}
                                  />
                                )}
                                {badge.icon === "crown" && (
                                  <Crown
                                    className={`h-5 w-5 text-${badge.color}-600`}
                                  />
                                )}
                                {badge.icon === "shield" && (
                                  <Shield
                                    className={`h-5 w-5 text-${badge.color}-600`}
                                  />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{badge.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {badge.description}
                                </p>
                                {badge.earnedDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Earned on{" "}
                                    {new Date(
                                      badge.earnedDate,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Badges to Earn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userBadges
                          .filter((badge) => !badge.earned)
                          .map((badge) => (
                            <div
                              key={badge.id}
                              className="flex items-start gap-3 p-3 border rounded-md bg-gray-50"
                            >
                              <div className="p-2 rounded-full bg-gray-200">
                                {badge.icon === "book" && (
                                  <BookOpen className="h-5 w-5 text-gray-400" />
                                )}
                                {badge.icon === "message" && (
                                  <MessageSquare className="h-5 w-5 text-gray-400" />
                                )}
                                {badge.icon === "star" && (
                                  <Star className="h-5 w-5 text-gray-400" />
                                )}
                                {badge.icon === "trending" && (
                                  <ShoppingBag className="h-5 w-5 text-gray-400" />
                                )}
                                {badge.icon === "award" && (
                                  <Award className="h-5 w-5 text-gray-400" />
                                )}
                                {badge.icon === "crown" && (
                                  <Crown className="h-5 w-5 text-gray-400" />
                                )}
                                {badge.icon === "shield" && (
                                  <Shield className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-500">
                                  {badge.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {badge.description}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
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

      {/* Level Up Modal */}
      <LevelUpModal
        open={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        newLevel={4}
        newBadges={newBadges}
      />

      {/* EXP Gain Toast */}
      <ExpGainToast
        expGained={5}
        action="Following a user"
        open={showExpGainToast}
        onOpenChange={setShowExpGainToast}
      />
    </div>
  );
}
