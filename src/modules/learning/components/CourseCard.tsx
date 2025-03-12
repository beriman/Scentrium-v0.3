import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Star } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  durationMinutes: number;
  instructorName: string;
  isFeatured?: boolean;
}

export default function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  price,
  level,
  durationMinutes,
  instructorName,
  isFeatured = false,
}: CourseCardProps) {
  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}j ` : ""}${mins > 0 ? `${mins}m` : ""}`;
  };

  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-50 text-green-700 border-green-200";
      case "intermediate":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "advanced":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Get level label in Indonesian
  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner":
        return "Pemula";
      case "intermediate":
        return "Menengah";
      case "advanced":
        return "Mahir";
      default:
        return level;
    }
  };

  return (
    <Card
      className={`overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md ${isFeatured ? "border-purple-300" : ""}`}
    >
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full aspect-video object-cover"
        />
        {isFeatured && (
          <Badge className="absolute top-2 right-2 bg-purple-600">
            Featured
          </Badge>
        )}
        <Badge
          variant="outline"
          className={`absolute bottom-2 left-2 ${getLevelBadgeColor(level)}`}
        >
          {getLevelLabel(level)}
        </Badge>
      </div>
      <CardContent className="flex-1 p-4">
        <Link to={`/learning/course/${id}`}>
          <h3 className="text-lg font-semibold text-purple-800 hover:text-purple-600 mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDuration(durationMinutes)}</span>
          <BookOpen className="h-4 w-4 ml-3 mr-1" />
          <span>Oleh {instructorName}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
        <div className="font-bold text-purple-700">{formatPrice(price)}</div>
        <Link
          to={`/learning/course/${id}`}
          className="text-sm text-purple-700 hover:text-purple-900 font-medium"
        >
          Lihat Detail
        </Link>
      </CardFooter>
    </Card>
  );
}
