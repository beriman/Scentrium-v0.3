import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { Edit, Settings, Star, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  userId?: string; // If not provided, show current user's profile
  isCurrentUser?: boolean;
}

export default function ProfileHeader({
  userId,
  isCurrentUser = true,
}: ProfileHeaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    level: 1,
    exp: 0,
    totalExp: 100,
    followers: 0,
    following: 0,
    threads: 0,
  });

  const profileId = userId || user?.id;

  useEffect(() => {
    if (!profileId) {
      setIsLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch user stats (in a real app, this would come from the database)
        // For now, we'll use mock data
        const mockStats = {
          level: Math.floor(Math.random() * 5) + 1,
          exp: Math.floor(Math.random() * 900) + 100,
          totalExp: 1000,
          followers: Math.floor(Math.random() * 100),
          following: Math.floor(Math.random() * 50),
          threads: Math.floor(Math.random() * 30),
        };
        setStats(mockStats);
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load profile data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId, toast]);

  const getMembershipBadge = (type: string | null) => {
    switch (type) {
      case "business":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">
            Business
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
            Admin
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
            Free
          </Badge>
        );
    }
  };

  const getLevelTitle = (level: number) => {
    switch (level) {
      case 1:
        return "Newbie";
      case 2:
        return "Explorer";
      case 3:
        return "Enthusiast";
      case 4:
        return "Expert";
      case 5:
        return "Master Perfumer";
      default:
        return "Newbie";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg overflow-hidden">
        {/* Edit Cover button */}
        {isCurrentUser && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-black/20 text-white hover:bg-black/40"
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Cover
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar */}
          <div className="absolute -top-16 left-6 ring-4 ring-white rounded-full">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="text-2xl bg-purple-100 text-purple-800">
                {profile.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Actions */}
          <div className="sm:ml-32 flex flex-col sm:flex-row justify-between w-full mt-16 sm:mt-0">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                {getMembershipBadge(profile.membership_type)}
              </div>
              <p className="text-gray-500">
                @{profile.username || profile.id.substring(0, 8)}
              </p>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-0">
              {isCurrentUser ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/profile/edit")}
                  >
                    <Settings className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                  <Button
                    className="bg-purple-700 hover:bg-purple-800"
                    onClick={() => navigate("/profile/membership")}
                  >
                    <Star className="h-4 w-4 mr-2" /> Upgrade
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" /> Follow
                  </Button>
                  <Button className="bg-purple-700 hover:bg-purple-800">
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <p className="text-gray-700">
            {profile.bio ||
              "No bio yet. Tell the community about yourself and your passion for fragrances!"}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">Level</div>
            <div className="flex items-center">
              <span className="text-xl font-bold mr-2">{stats.level}</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {getLevelTitle(stats.level)}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">EXP</div>
            <div className="text-xl font-bold">
              {stats.exp}/{stats.totalExp}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">Followers</div>
            <div className="text-xl font-bold">{stats.followers}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">Following</div>
            <div className="text-xl font-bold">{stats.following}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">Threads</div>
            <div className="text-xl font-bold">{stats.threads}</div>
          </div>
        </div>

        <Separator className="mt-6" />
      </div>
    </div>
  );
}
