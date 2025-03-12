import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";

interface QuizComponentProps {
  courseId: string;
  lessonId: string;
  onComplete?: (score: number, passed: boolean) => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export default function QuizComponent({
  courseId,
  lessonId,
  onComplete,
}: QuizComponentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [previousAttempt, setPreviousAttempt] = useState<any>(null);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        // Fetch quiz questions for this lesson
        const { data: quizData, error: quizError } = await supabase
          .from("learning_quiz_questions")
          .select("*")
          .eq("lesson_id", lessonId)
          .order("order");

        if (quizError) throw quizError;

        if (quizData && quizData.length > 0) {
          setQuestions(quizData);
        }

        // Check if user has already completed this quiz
        if (user) {
          const { data: attemptData, error: attemptError } = await supabase
            .from("learning_quiz_attempts")
            .select("*")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .order("created_at", { ascending: false })
            .limit(1);

          if (!attemptError && attemptData && attemptData.length > 0) {
            setPreviousAttempt(attemptData[0]);
          }
        }
      } catch (error: any) {
        console.error("Error fetching quiz questions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load quiz questions. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [lessonId, user, toast]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    const answeredQuestions = Object.keys(selectedAnswers).length;
    if (answeredQuestions < questions.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: `Please answer all questions before submitting. (${answeredQuestions}/${questions.length} answered)`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalScore = calculateScore();
      const passed = finalScore >= 70; // Pass threshold is 70%

      // Save quiz attempt to database
      if (user) {
        const { error } = await supabase.from("learning_quiz_attempts").insert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          score: finalScore,
          passed: passed,
          answers: selectedAnswers,
        });

        if (error) throw error;

        // Update user progress
        if (passed) {
          const { error: progressError } = await supabase
            .from("learning_user_progress")
            .upsert({
              user_id: user.id,
              lesson_id: lessonId,
              course_id: courseId,
              completed: true,
              quiz_completed: true,
              last_position: 0, // Reset video position
              updated_at: new Date().toISOString(),
            });

          if (progressError) throw progressError;
        }
      }

      setScore(finalScore);
      setQuizCompleted(true);
      setShowResults(true);

      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(finalScore, passed);
      }

      toast({
        title: passed ? "Quiz Passed!" : "Quiz Failed",
        description: passed
          ? `Congratulations! You scored ${finalScore.toFixed(0)}%`
          : `You scored ${finalScore.toFixed(0)}%. You need 70% to pass.`,
        variant: passed ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const retakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setShowResults(false);
    setScore(0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading quiz questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Quiz Available</h3>
          <p className="text-gray-500">
            There are no quiz questions available for this lesson yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show previous attempt if exists and user hasn't started a new attempt
  if (
    previousAttempt &&
    !Object.keys(selectedAnswers).length &&
    !quizCompleted
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${previousAttempt.passed ? "bg-green-100" : "bg-red-100"} mb-4`}
            >
              {previousAttempt.passed ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {previousAttempt.passed ? "Quiz Passed!" : "Quiz Failed"}
            </h3>
            <p className="text-gray-600 mb-4">
              You scored {previousAttempt.score.toFixed(0)}% on your last
              attempt
            </p>
            <div className="w-full max-w-md mx-auto mb-6">
              <Progress value={previousAttempt.score} className="h-3" />
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Completed on{" "}
              {new Date(previousAttempt.created_at).toLocaleDateString()}
            </p>
            <Button
              onClick={retakeQuiz}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show quiz results after submission
  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${score >= 70 ? "bg-green-100" : "bg-red-100"} mb-4`}
            >
              {score >= 70 ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {score >= 70 ? "Quiz Passed!" : "Quiz Failed"}
            </h3>
            <p className="text-gray-600 mb-4">
              You scored {score.toFixed(0)}%
              {score < 70 && " (70% required to pass)"}
            </p>
            <div className="w-full max-w-md mx-auto mb-6">
              <Progress value={score} className="h-3" />
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const selectedAnswer = selectedAnswers[question.id];
              const isCorrect = selectedAnswer === question.correct_answer;

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    {selectedAnswer !== undefined && (
                      <div
                        className={`flex items-center ${isCorrect ? "text-green-600" : "text-red-600"}`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 mr-1" />
                        ) : (
                          <XCircle className="h-5 w-5 mr-1" />
                        )}
                        {isCorrect ? "Correct" : "Incorrect"}
                      </div>
                    )}
                  </div>
                  <p className="mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-md border ${selectedAnswer === optionIndex && isCorrect ? "bg-green-50 border-green-200" : selectedAnswer === optionIndex && !isCorrect ? "bg-red-50 border-red-200" : question.correct_answer === optionIndex ? "bg-green-50 border-green-200" : "border-gray-200"}`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md border border-blue-200">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={retakeQuiz}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show quiz questions
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Quiz</span>
          <span className="text-sm font-normal">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <Progress
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            className="h-2"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">
            {currentQuestion.question}
          </h3>
          <RadioGroup
            value={selectedAnswers[currentQuestion.id]?.toString()}
            onValueChange={(value) =>
              handleAnswerSelect(currentQuestion.id, parseInt(value))
            }
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer py-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              className="bg-purple-700 hover:bg-purple-800"
              disabled={selectedAnswers[currentQuestion.id] === undefined}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              className="bg-purple-700 hover:bg-purple-800"
              disabled={
                isSubmitting ||
                selectedAnswers[currentQuestion.id] === undefined
              }
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
