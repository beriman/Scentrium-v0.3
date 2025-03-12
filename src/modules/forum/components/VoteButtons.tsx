import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  initialUpvotes?: number;
  initialDownvotes?: number;
  initialUserVote?: "upvote" | "downvote" | null;
  threadId?: string;
  replyId?: string;
  onVote?: (
    type: "upvote" | "downvote",
    threadId?: string,
    replyId?: string,
  ) => void;
  vertical?: boolean;
  showStats?: boolean;
}

export default function VoteButtons({
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
  threadId,
  replyId,
  onVote,
  vertical = false,
  showStats = true,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(
    initialUserVote,
  );

  const handleVote = (type: "upvote" | "downvote") => {
    // If user clicks the same vote type again, remove their vote
    if (userVote === type) {
      if (type === "upvote") {
        setUpvotes(upvotes - 1);
      } else {
        setDownvotes(downvotes - 1);
      }
      setUserVote(null);
    }
    // If user is changing their vote
    else if (userVote !== null) {
      if (type === "upvote") {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
      } else {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      }
      setUserVote(type);
    }
    // If user is voting for the first time
    else {
      if (type === "upvote") {
        setUpvotes(upvotes + 1);
      } else {
        setDownvotes(downvotes + 1);
      }
      setUserVote(type);
    }

    // Call the onVote callback if provided
    if (onVote) {
      onVote(type, threadId, replyId);
    }
  };

  const voteScore = upvotes - downvotes;
  const voteClass =
    voteScore > 0
      ? "text-green-600"
      : voteScore < 0
        ? "text-red-600"
        : "text-gray-500";

  return (
    <div
      className={cn(
        "flex items-center",
        vertical ? "flex-col space-y-1" : "space-x-2",
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full p-0 h-8 w-8",
          userVote === "upvote"
            ? "bg-green-100 text-green-600"
            : "hover:bg-green-50 hover:text-green-600",
        )}
        onClick={() => handleVote("upvote")}
        title="Cendol (Upvote)"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      {showStats && (
        <div className={cn("text-sm font-medium", voteClass)}>{voteScore}</div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full p-0 h-8 w-8",
          userVote === "downvote"
            ? "bg-red-100 text-red-600"
            : "hover:bg-red-50 hover:text-red-600",
        )}
        onClick={() => handleVote("downvote")}
        title="Bata (Downvote)"
      >
        <ArrowDown className="h-5 w-5" />
      </Button>

      {showStats && vertical && (
        <div className="text-xs text-gray-500 mt-1">
          <span className="text-green-600">{upvotes}</span> /{" "}
          <span className="text-red-600">{downvotes}</span>
        </div>
      )}
    </div>
  );
}
