import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProfileWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      {/* Cover Photo */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-t-lg relative">
        <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-1">
            <div className="w-full h-full bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-12 sm:pt-16 px-4 sm:px-8 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">John Doe</h2>
            <p className="text-gray-600">@johndoe</p>
            <p className="mt-2 text-gray-700 text-sm sm:text-base">
              Fragrance enthusiast and perfumer based in Jakarta
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200">
              Edit Profile
            </button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-purple-700 text-white rounded-md hover:bg-purple-800">
              Upgrade to Business
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-4 sm:space-x-6 mt-4 sm:mt-6">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold">42</div>
            <div className="text-xs sm:text-sm text-gray-600">Threads</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold">128</div>
            <div className="text-xs sm:text-sm text-gray-600">Following</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold">256</div>
            <div className="text-xs sm:text-sm text-gray-600">Followers</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 overflow-x-auto">
        <div className="flex">
          <div className="px-3 sm:px-6 py-2 sm:py-3 border-b-2 border-purple-700 text-purple-700 font-medium text-sm sm:text-base whitespace-nowrap">
            Activity
          </div>
          <div className="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 text-sm sm:text-base whitespace-nowrap">
            Badges
          </div>
          <div className="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 text-sm sm:text-base whitespace-nowrap">
            Statistics
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm sm:text-base">
                    Posted in Forum
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    2 hours ago
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-gray-800 text-sm sm:text-base">
                  Shared thoughts on the new Scentrium exclusive fragrance...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BadgesWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-md mx-auto p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Your Badges</h2>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
            Level Badges
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {["Explorer", "Enthusiast", "Expert"].map((badge) => (
              <div key={badge} className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-200 rounded-full"></div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-center">
                  {badge}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
            Achievement Badges
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {["Top Contributor", "IFRA Master", "Reviewer"].map((badge) => (
              <div key={badge} className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-center">
                  {badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-xs sm:text-sm font-medium mb-1">
              Level Progress
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
          <div className="ml-3 sm:ml-4 text-right">
            <div className="text-base sm:text-lg font-bold">Level 3</div>
            <div className="text-xs text-gray-600">650/1000 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfileWireframes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8 bg-gray-100">
      <Card className="overflow-hidden col-span-1 md:col-span-2">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <ProfileWireframe />
        </CardContent>
      </Card>

      <Card className="overflow-hidden col-span-1">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Badges & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <BadgesWireframe />
        </CardContent>
      </Card>
    </div>
  );
}
