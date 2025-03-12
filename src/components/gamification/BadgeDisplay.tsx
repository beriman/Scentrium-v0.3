import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  MessageSquare,
  Star,
  Award,
  TrendingUp,
  Shield,
  Crown,
} from "lucide-react";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedDate?: string;
}

interface BadgeDisplayProps {
  badges: BadgeItem[];
  showAll?: boolean;
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
}

export default function BadgeDisplay({
  badges,
  showAll = false,
  maxDisplay = 5,
  size = "md",
}: BadgeDisplayProps) {
  const displayBadges = showAll
    ? badges
    : badges.filter((badge) => badge.earned).slice(0, maxDisplay);
  const earnedCount = badges.filter((badge) => badge.earned).length;
  const totalCount = badges.length;

  const getIcon = (iconName: string) => {
    const iconProps = {
      className: `${size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"} mr-1`,
    };

    switch (iconName) {
      case "book":
        return <BookOpen {...iconProps} />;
      case "message":
        return <MessageSquare {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      case "award":
        return <Award {...iconProps} />;
      case "trending":
        return <TrendingUp {...iconProps} />;
      case "shield":
        return <Shield {...iconProps} />;
      case "crown":
        return <Crown {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  const getBadgeStyle = (color: string, earned: boolean) => {
    if (!earned) return "bg-gray-100 text-gray-400 border-gray-200 opacity-60";

    switch (color) {
      case "purple":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      case "indigo":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "pink":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {displayBadges.map((badge) => (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 py-1 px-2 ${getBadgeStyle(badge.color, badge.earned)}`}
                >
                  {getIcon(badge.icon)}
                  {badge.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{badge.name}</p>
                  <p>{badge.description}</p>
                  {badge.earned && badge.earnedDate && (
                    <p className="text-xs mt-1">
                      Earned on {formatDate(badge.earnedDate)}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {!showAll && earnedCount < totalCount && (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-600 border-gray-200"
          >
            +{totalCount - earnedCount} more
          </Badge>
        )}
      </div>
    </div>
  );
}
