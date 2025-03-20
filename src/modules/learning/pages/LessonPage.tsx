import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  BookOpen,
  List,
} from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [lesson, setLesson] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState<any>(null);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [prevLesson, setPrevLesson] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        // Fetch lesson details
        const { data: lessonData, error: lessonError } = await supabase
          .from("learning_lessons")
          .select("*")
          .eq("id", lessonId)
          .single();

        if (lessonError) throw lessonError;
        setLesson(lessonData);

        // Fetch module details
        const { data: moduleData, error: moduleError } = await supabase
          .from("learning_modules")
          .select("*")
          .eq("id", lessonData.module_id)
          .single();

        if (moduleError) throw moduleError;
        setModule(moduleData);

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from("learning_courses")
          .select("*")
          .eq("id", moduleData.course_id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch all modules and lessons for the course
        const { data: modulesData, error: modulesError } = await supabase
          .from("learning_modules")
          .select("*, lessons:learning_lessons(*)")
          .eq("course_id", moduleData.course_id)
          .order("order_number", { ascending: true });

        if (modulesError) throw modulesError;

        // Sort lessons by order_number and flatten into a single array
        const allLessonsFlat = modulesData
          .map((mod) => ({
            ...mod,
            lessons: mod.lessons.sort(
              (a: any, b: any) => a.order_number - b.order_number,
            ),
          }))
          .flatMap((mod) =>
            mod.lessons.map((les: any) => ({
              ...les,
              module_title: mod.title,
              module_order: mod.order_number,
            })),
          );

        setAllLessons(allLessonsFlat);

        // Find current lesson index
        const currentIndex = allLessonsFlat.findIndex(
          (les: any) => les.id === lessonId,
        );

        // Set next and previous lessons
        if (currentIndex > 0) {
          setPrevLesson(allLessonsFlat[currentIndex - 1]);
        }

        if (currentIndex < allLessonsFlat.length - 1) {
          setNextLesson(allLessonsFlat[currentIndex + 1]);
        }

        // Fetch related product if any
        if (lessonData.related_product_id) {
          const { data: productData, error: productError } = await supabase
            .from("marketplace_products")
            .select("*")
            .eq("id", lessonData.related_product_id)
            .single();

          if (!productError) {
            setRelatedProduct(productData);
          }
        }

        // Check if user is enrolled
        if (user) {
          const { data: enrollmentData, error: enrollmentError } =
            await supabase
              .from("learning_enrollments")
              .select("*")
              .eq("user_id", user.id)
              .eq("course_id", moduleData.course_id)
              .single();

          if (!enrollmentError && enrollmentData.payment_status === "paid") {
            setIsEnrolled(true);
          }

          // Get lesson progress
          const { data: progressData, error: progressError } = await supabase
            .from("learning_progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .single();

          if (!progressError) {
            setProgress(progressData);
          }
        }
      } catch (error: any) {
        console.error("Error fetching lesson details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load lesson details. Please try again.",
        });
        navigate("/learning");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonDetails();
  }, [lessonId, user, navigate, toast]);

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
    return `${hours > 0 ? `${hours} jam ` : ""}${mins > 0 ? `${mins} menit` : ""}`;
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

  // Check if user can access this lesson
  const canAccessLesson = lesson.is_preview || isEnrolled;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          to={`/learning/course/${course.id}`}
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Kursus
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-800 mb-2">
              {lesson.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {module.title} • {formatDuration(lesson.duration_minutes)}
            </p>

            {/* Video Player */}
            <div className="mb-6">
              <VideoPlayer
                videoUrl={lesson.video_url}
                lessonId={lesson.id}
                isPreview={lesson.is_preview}
                isEnrolled={isEnrolled}
                thumbnailUrl={course.thumbnail_url}
              />
            </div>

            {/* Lesson Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi Pelajaran</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{lesson.description}</p>

                {progress?.status === "completed" && (
                  <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-200 flex items-center">
                    <CheckCircle className="h-5 w-5