import React from "react";
import { Progress } from "@/components/ui/progress";

interface ExperienceBarProps {
  currentExp: number;
  nextLevelExp: number;
  level: number;
  className?: string;
}

export default function ExperienceBar({
  currentExp,
  nextLevelExp,
  level,
  className = "",
}: ExperienceBarProps) {
  const progress = Math.min(Math.floor((currentExp / nextLevelExp) * 100), 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <div className="bg-purple-100 text-purple-800 font-medium rounded-full h-5 w-5 flex items-center justify-center mr-1.5">
            {level}
          </div>
          <span>Level {level}</span>
        </div>
        <span>
          {currentExp}/{nextLevelExp} EXP
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Current</span>
        <span>Next Level</span>
      </div>
    </div>
  );
}
