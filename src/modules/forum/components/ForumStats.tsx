import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, TrendingUp, Award } from "lucide-react";

interface ForumStatsProps {
  totalThreads?: number;
  totalReplies?: number;
  activeUsers?: number;
  topContributors?: {
    id: string;
    name: string;
    avatar: string;
    contributions: number;
  }[];
}

export default function ForumStats({
  totalThreads = 1250,
  totalReplies = 8745,
  activeUsers = 324,
  topContributors = [
    {
      id: "user1",
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      contributions: 156,
    },
    {
      id: "user2",
      name: "Alex Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      contributions: 142,
    },
    {
      id: "user3",
      name: "Maria Garcia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      contributions: 128,
    },
    {
      id: "user4",
      name: "Budi Santoso",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
      contributions: 115,
    },
    {
      id: "user5",
      name: "Dian Wijaya",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dian",
      contributions: 98,
    },
  ],
}: ForumStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Statistik Forum</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <MessageSquare className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Thread</div>
              <div className="font-semibold">
                {totalThreads.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <MessageSquare className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Balasan</div>
              <div className="font-semibold">
                {totalReplies.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <Users className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Pengguna Aktif</div>
              <div className="font-semibold">
                {activeUsers.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Aktivitas Harian</div>
              <div className="font-semibold">
                +{Math.floor(totalReplies / 30)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium flex items-center mb-3">
            <Award className="h-4 w-4 mr-1 text-purple-700" /> Top Kontributor
          </h3>
          <div className="space-y-3">
            {topContributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 text-xs text-gray-500">{index + 1}.</div>
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm">{contributor.name}</span>
                </div>
                <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {contributor.contributions} kontribusi
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
