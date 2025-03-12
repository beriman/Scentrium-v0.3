import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import QuizComponent from "./QuizComponent";

interface LessonQuizProps {
  courseId: string;
  lessonId: string;
  onQuizComplete?: (passed: boolean) => void;
}

export default function LessonQuiz({
  courseId,
  lessonId,
  onQuizComplete,
}: LessonQuizProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        // Check if quiz exists for this lesson
        const { data: quizData, error: quizError } = await supabase
          .from("learning_quiz_questions")
          .select("id")
          .eq("lesson_id", lessonId)
          .limit(1);

        if (quizError) throw quizError;
        setHasQuiz(quizData && quizData.length > 0);

        // Check if user has completed the quiz
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from("learning_user_progress")
            .select("quiz_completed")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .single();

          if (!progressError && progressData) {
            setQuizCompleted(progressData.quiz_completed);
            if (progressData.quiz_completed) {
              setQuizPassed(true);
            }
          }

          // If not completed, check if there are any attempts
          if (!progressError && !progressData?.quiz_completed) {
            const { data: attemptData, error: attemptError } = await supabase
              .from("learning_quiz_attempts")
              .select("passed")
              .eq("user_id", user.id)
              .eq("lesson_id", lessonId)
              .order("created_at", { ascending: false })
              .limit(1);

            if (!attemptError && attemptData && attemptData.length > 0) {
              setQuizPassed(attemptData[0].passed);
            }
          }
        }
      } catch (error) {
        console.error("Error checking quiz status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkQuizStatus();
  }, [lessonId, user]);

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizCompleted(true);
    setQuizPassed(passed);
    if (onQuizComplete) {
      onQuizComplete(passed);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading quiz information...</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasQuiz) {
    return null; // Don't show anything if there's no quiz
  }

  if (showQuiz) {
    return (
      <QuizComponent
        courseId={courseId}
        lessonId={lessonId}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" /> Lesson Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {quizCompleted ? (
          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-md border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Quiz Completed</h3>
              <p className="text-green-700">
                You've successfully completed this quiz.
              </p>
            </div>
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => setShowQuiz(true)}
            >
              Review Quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Complete the Quiz</h3>
                <p className="text-gray-600">
                  Test your knowledge of this lesson by taking the quiz. You
                  need to score at least 70% to pass.
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-purple-700 hover:bg-purple-800"
              onClick={() => setShowQuiz(true)}
            >
              Start Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
