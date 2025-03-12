import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Eye, Clock } from "lucide-react";
import VoteButtons from "./VoteButtons";
import { FORUM_CATEGORIES } from "./CategorySelector";

export interface ThreadCardProps {
  id: string;
  title: string;
  preview: string;
  categoryId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  upvotes: number;
  downvotes: number;
  userVote?: "upvote" | "downvote" | null;
  replies: number;
  views: number;
  createdAt: string;
  onVote?: (type: "upvote" | "downvote", threadId: string) => void;
}

export default function ThreadCard({
  id,
  title,
  preview,
  categoryId,
  author,
  upvotes,
  downvotes,
  userVote,
  replies,
  views,
  createdAt,
  onVote,
}: ThreadCardProps) {
  // Find category name from ID
  const category = FORUM_CATEGORIES.find((cat) => cat.id === categoryId);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote buttons */}
          <div className="hidden sm:block">
            <VoteButtons
              initialUpvotes={upvotes}
              initialDownvotes={downvotes}
              initialUserVote={userVote}
              threadId={id}
              onVote={onVote}
              vertical={true}
            />
          </div>

          {/* Thread content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Link to={`/forum/thread/${id}`} className="block">
                  <h3 className="text-xl font-semibold text-purple-800 hover:text-purple-600">
                    {title}
                  </h3>
                </Link>
                <p className="text-gray-600">{preview}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {category?.name || "Kategori"}
                  </Badge>
                  <span className="flex items-center text-gray-500">
                    <MessageSquare className="mr-1 h-4 w-4" /> {replies} balasan
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Eye className="mr-1 h-4 w-4" /> {views} dilihat
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Clock className="mr-1 h-4 w-4" /> {createdAt}
                  </span>

                  {/* Mobile vote buttons */}
                  <div className="sm:hidden">
                    <VoteButtons
                      initialUpvotes={upvotes}
                      initialDownvotes={downvotes}
                      initialUserVote={userVote}
                      threadId={id}
                      onVote={onVote}
                      vertical={false}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name[0]}</AvatarFallback>
                </Avatar>
                <Link
                  to={`/profile/${author.id}`}
                  className="hover:text-purple-700"
                >
                  <div>{author.name}</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
