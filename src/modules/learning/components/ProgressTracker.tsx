import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { CheckCircle, Clock, BookOpen, Award } from "lucide-react";

interface ProgressTrackerProps {
  courseId: string;
  onProgressUpdate?: (progress: number) => void;
}

export default function ProgressTracker({
  courseId,
  onProgressUpdate,
}: ProgressTrackerProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0); // in minutes
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get total lessons in the course
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("learning_lessons")
          .select("id")
          .eq("course_id", courseId);

        if (lessonsError) throw lessonsError;
        const totalLessonsCount = lessonsData?.length || 0;
        setTotalLessons(totalLessonsCount);

        // Get user progress for this course
        const { data: progressData, error: progressError } = await supabase
          .from("learning_user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId);

        if (progressError) throw progressError;

        // Calculate completed lessons and quizzes
        const completedLessonsCount =
          progressData?.filter((item) => item.completed).length || 0;
        const completedQuizzesCount =
          progressData?.filter((item) => item.quiz_completed).length || 0;

        setCompletedLessons(completedLessonsCount);
        setCompletedQuizzes(completedQuizzesCount);

        // Calculate overall progress percentage
        const progressPercentage =
          totalLessonsCount > 0
            ? (completedLessonsCount / totalLessonsCount) * 100
            : 0;
        setProgress(progressPercentage);

        // Call the onProgressUpdate callback if provided
        if (onProgressUpdate) {
          onProgressUpdate(progressPercentage);
        }

        // Get time spent data
        const { data: timeData, error: timeError } = await supabase
          .from("learning_time_tracking")
          .select("duration")
          .eq("user_id", user.id)
          .eq("course_id", courseId);

        if (timeError) throw timeError;

        // Calculate total time spent in minutes
        const totalTimeSpent =
          timeData?.reduce((sum, item) => sum + (item.duration || 0), 0) || 0;
        setTimeSpent(Math.round(totalTimeSpent / 60)); // Convert seconds to minutes

        // Get last activity timestamp
        const { data: lastActivityData, error: lastActivityError } =
          await supabase
            .from("learning_user_progress")
            .select("updated_at")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .order("updated_at", { ascending: false })
            .limit(1);

        if (lastActivityError) throw lastActivityError;
        setLastActivity(
          lastActivityData && lastActivityData.length > 0
            ? lastActivityData[0].updated_at
            : null,
        );
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user, courseId, onProgressUpdate]);

  const formatLastActivity = (timestamp: string | null) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div>Loading progress...</div>;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Sign in to track your progress</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" /> Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Course Completion</span>
            <Badge
              variant="outline"
              className={
                progress === 100
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }
            >
              {progress === 100 ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" /> Completed
                </>
              ) : (
                `${Math.round(progress)}%`
              )}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Lessons Completed</p>
              <p className="font-medium">
                {completedLessons} / {totalLessons}
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 flex items-start">
            <Award className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Quizzes Passed</p>
              <p className="font-medium">
                {completedQuizzes} / {totalLessons}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Time Spent
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Last Activity
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {timeSpent} {timeSpent === 1 ? "minute" : "minutes"}
            </span>
            <span className="font-medium">
              {formatLastActivity(lastActivity)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
