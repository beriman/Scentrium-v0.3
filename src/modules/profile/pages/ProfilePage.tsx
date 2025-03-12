import { useState } from "react";
import { useAuth } from "../../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck, Edit, User, Mail, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Award, BookOpen, Clock } from "lucide-react";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState("activity");

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

  const isBusinessAccount = profile?.membership_type === "business";
  const has2FAEnabled = profile?.has_2fa;

  // Mock data for the profile tabs
  const mockActivities = [
    {
      id: 1,
      type: "forum",
      title: "Posted in 'Essential Oils Discussion'",
      content: "Shared experience with lavender essential oil blends",
      date: "2 days ago",
    },
    {
      id: 2,
      type: "marketplace",
      title: "Listed a new product",
      content: "Woody Elegance EDP - 100ml",
      date: "1 week ago",
    },
  ];

  const mockBadges = [
    {
      id: 1,
      name: "Enthusiast",
      description: "Reached Level 3",
      icon: "🌟",
      date: "2023-08-15",
    },
    {
      id: 2,
      name: "Top Contributor",
      description: "Created 50+ helpful forum posts",
      icon: "🏆",
      date: "2023-09-10",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - User info */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-purple-100">
                    <AvatarImage
                      src={
                        profile?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                      }
                      alt={profile?.full_name || user.email || ""}
                    />
                    <AvatarFallback>
                      {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-xl font-semibold mb-1">
                    {profile?.full_name || user.email?.split("@")[0]}
                  </h2>

                  <p className="text-gray-500 mb-3">{user.email}</p>

                  <Badge
                    className={`${isBusinessAccount ? "bg-purple-700" : "bg-blue-600"}`}
                  >
                    {isBusinessAccount ? "Business Account" : "Free Account"}
                  </Badge>

                  <div className="mt-6 w-full">
                    <Link to="/profile/edit">
                      <Button variant="outline" className="w-full">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-2 w-full">
                    <Link to="/profile/membership">
                      <Button className="w-full bg-purple-700 hover:bg-purple-800">
                        {isBusinessAccount
                          ? "Manage Membership"
                          : "Upgrade to Business"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Account details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Full Name</h3>
                      <p className="text-gray-600">
                        {profile?.full_name || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Email Address</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Member Since</h3>
                      <p className="text-gray-600">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Security section */}
                <div>
                  <h3 className="font-semibold mb-4">Security</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShieldCheck className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="font-medium">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-500">
                            {has2FAEnabled
                              ? "Enabled - Your account has an extra layer of security"
                              : "Disabled - Enable for additional security"}
                          </p>
                        </div>
                      </div>

                      {isBusinessAccount && (
                        <Link to="/setup-2fa">
                          <Button variant="outline" size="sm">
                            {has2FAEnabled ? "Manage" : "Enable"}
                          </Button>
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-500">
                          Change your password
                        </p>
                      </div>

                      <Link to="/reset-password">
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="badges">
                    Badges & Achievements
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="mt-6">
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="rounded-full p-2 bg-purple-100 text-purple-800">
                            {activity.type === "forum" ? (
                              <MessageSquare className="h-5 w-5" />
                            ) : activity.type === "marketplace" ? (
                              <Award className="h-5 w-5" />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{activity.title}</h3>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />{" "}
                                {activity.date}
                              </span>
                            </div>
                            <p className="text-gray-600">{activity.content}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="badges" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockBadges.map((badge) => (
                      <Card key={badge.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="text-4xl">{badge.icon}</div>
                          <div>
                            <h3 className="font-medium">{badge.name}</h3>
                            <p className="text-sm text-gray-600">
                              {badge.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Earned on{" "}
                              {new Date(badge.date).toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
