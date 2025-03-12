import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  MoveUp,
  MoveDown,
  HelpCircle,
  CheckCircle,
} from "lucide-react";

interface QuizQuestion {
  id?: string;
  lesson_id: string;
  course_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  order: number;
}

export default function QuizEditorPage() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.role !== "admin") {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to access this page.",
          });
          navigate("/learning");
          return;
        }

        // Fetch lesson and course info
        const { data: lessonData, error: lessonError } = await supabase
          .from("learning_lessons")
          .select("title, course:course_id(title)")
          .eq("id", lessonId)
          .single();

        if (lessonError) throw lessonError;
        setLessonTitle(lessonData.title);
        setCourseTitle(lessonData.course.title);

        // Fetch existing quiz questions
        const { data: quizData, error: quizError } = await supabase
          .from("learning_quiz_questions")
          .select("*")
          .eq("lesson_id", lessonId)
          .order("order");

        if (quizError) throw quizError;

        if (quizData && quizData.length > 0) {
          setQuestions(quizData);
        } else {
          // Initialize with one empty question
          setQuestions([
            {
              lesson_id: lessonId || "",
              course_id: courseId || "",
              question: "",
              options: ["", "", "", ""],
              correct_answer: 0,
              order: 0,
            },
          ]);
        }
      } catch (error: any) {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An error occurred. Please try again.",
        });
        navigate("/learning");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, courseId, lessonId, navigate, toast]);

  const handleQuestionChange = (
    index: number,
    field: keyof QuizQuestion,
    value: any,
  ) => {
    const updatedQuestions = [...questions];
    if (field === "options") {
      // Handle options array separately
      updatedQuestions[index][field] = value;
    } else {
      // @ts-ignore - we know the field exists
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        lesson_id: lessonId || "",
        course_id: courseId || "",
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        order: questions.length,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must have at least one question.",
      });
      return;
    }

    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Update order for remaining questions
    updatedQuestions.forEach((q, i) => {
      q.order = i;
    });
    setQuestions(updatedQuestions);
  };

  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    const updatedQuestions = [...questions];
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[index - 1];
    updatedQuestions[index - 1] = temp;
    // Update order
    updatedQuestions[index].order = index;
    updatedQuestions[index - 1].order = index - 1;
    setQuestions(updatedQuestions);
  };

  const moveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return;
    const updatedQuestions = [...questions];
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[index + 1];
    updatedQuestions[index + 1] = temp;
    // Update order
    updatedQuestions[index].order = index;
    updatedQuestions[index + 1].order = index + 1;
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Question ${i + 1} is empty.`,
        });
        return false;
      }

      // Check if all options have content
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: `Option ${j + 1} in Question ${i + 1} is empty.`,
          });
          return false;
        }
      }
    }
    return true;
  };

  const saveQuiz = async () => {
    if (!validateQuestions()) return;

    setIsSaving(true);

    try {
      // First, delete all existing questions for this lesson
      const { error: deleteError } = await supabase
        .from("learning_quiz_questions")
        .delete()
        .eq("lesson_id", lessonId);

      if (deleteError) throw deleteError;

      // Then insert all questions
      const { error: insertError } = await supabase
        .from("learning_quiz_questions")
        .insert(
          questions.map((q) => ({
            lesson_id: lessonId,
            course_id: courseId,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            order: q.order,
          })),
        );

      if (insertError) throw insertError;

      toast({
        title: "Quiz Saved",
        description: "Quiz questions have been saved successfully.",
      });

      // Navigate back to lesson page
      navigate(`/learning/admin/lesson/${lessonId}`);
    } catch (error: any) {
      console.error("Error saving quiz:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save quiz. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Link
          to={`/learning/admin/lesson/${lessonId}`}
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lesson
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quiz Editor</CardTitle>
          <CardDescription>
            {courseTitle} - {lessonTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-700 mb-1">
                  Quiz Instructions
                </h3>
                <ul className="text-sm text-blue-600 space-y-1 list-disc pl-5">
                  <li>Each question must have exactly 4 options</li>
                  <li>
                    Select the correct answer by clicking the radio button
                  </li>
                  <li>
                    You can add explanations to help students understand the
                    correct answer
                  </li>
                  <li>Use the arrows to reorder questions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="border-2">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      Question {questionIndex + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveQuestionUp(questionIndex)}
                        disabled={questionIndex === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveQuestionDown(questionIndex)}
                        disabled={questionIndex === questions.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${questionIndex}`}>
                      Question
                    </Label>
                    <Textarea
                      id={`question-${questionIndex}`}
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "question",
                          e.target.value,
                        )
                      }
                      placeholder="Enter your question here"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Options</Label>
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <input
                          type="radio"
                          id={`q${questionIndex}-option${optionIndex}`}
                          name={`q${questionIndex}-correct`}
                          checked={question.correct_answer === optionIndex}
                          onChange={() =>
                            handleQuestionChange(
                              questionIndex,
                              "correct_answer",
                              optionIndex,
                            )
                          }
                          className="h-4 w-4 text-purple-600"
                        />
                        <Label
                          htmlFor={`q${questionIndex}-option${optionIndex}`}
                          className="flex-1 cursor-pointer"
                        >
                          <Input
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Option ${optionIndex + 1}`}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </Label>
                        {question.correct_answer === optionIndex && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor={`explanation-${questionIndex}`}>
                      Explanation (Optional)
                    </Label>
                    <Textarea
                      id={`explanation-${questionIndex}`}
                      value={question.explanation || ""}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "explanation",
                          e.target.value,
                        )
                      }
                      placeholder="Explain why the correct answer is right (shown after answering)"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={addQuestion}
            variant="outline"
            className="mt-6 w-full border-dashed border-gray-300 text-gray-600 hover:text-purple-700 hover:border-purple-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/learning/admin/lesson/${lessonId}`)}
          >
            Cancel
          </Button>
          <Button
            onClick={saveQuiz}
            className="bg-purple-700 hover:bg-purple-800"
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Quiz
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
