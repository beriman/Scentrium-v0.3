import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
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
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700">
                      Anda telah menyelesaikan pelajaran ini
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Product */}
            {relatedProduct && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Kit Pembelajaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden">
                      <img
                        src={
                          relatedProduct.images?.[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={relatedProduct.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{relatedProduct.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {relatedProduct.brand} • {relatedProduct.size}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-700">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <Link to={`/marketplace/product/${relatedProduct.id}`}>
                          <Button
                            variant="outline"
                            className="text-purple-700 border-purple-200"
                          >
                            <ShoppingBag className="h-4 w-4 mr-1" /> Beli Kit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {prevLesson ? (
                <Link
                  to={`/learning/lesson/${prevLesson.id}`}
                  className="flex items-center text-purple-700 hover:text-purple-900"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Pelajaran Sebelumnya
                </Link>
              ) : (
                <div></div>
              )}

              {nextLesson && (canAccessLesson || nextLesson.is_preview) && (
                <Link
                  to={`/learning/lesson/${nextLesson.id}`}
                  className="flex items-center text-purple-700 hover:text-purple-900"
                >
                  Pelajaran Selanjutnya <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" /> Konten Kursus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {Object.values(
                  allLessons.reduce((acc: any, les: any) => {
                    const moduleKey = `module-${les.module_order}`;
                    if (!acc[moduleKey]) {
                      acc[moduleKey] = {
                        title: les.module_title,
                        order: les.module_order,
                        lessons: [],
                      };
                    }
                    acc[moduleKey].lessons.push(les);
                    return acc;
                  }, {}),
                )
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((mod: any, modIndex: number) => (
                    <div key={`module-${mod.order}`} className="py-2 px-4">
                      <div className="font-medium py-2">
                        Module {modIndex + 1}: {mod.title}
                      </div>
                      <ul className="space-y-1">
                        {mod.lessons.map((les: any, lesIndex: number) => {
                          const isCurrentLesson = les.id === lesson.id;
                          const canAccess = les.is_preview || isEnrolled;
                          const isCompleted =
                            progress?.status === "completed" ||
                            (les.id !== lesson.id &&
                              allLessons.findIndex((l) => l.id === les.id) <
                                allLessons.findIndex(
                                  (l) => l.id === lesson.id,
                                ));

                          return (
                            <li
                              key={les.id}
                              className={`pl-4 py-1 border-l-2 ${isCurrentLesson ? "border-purple-500 bg-purple-50" : isCompleted ? "border-green-500" : "border-transparent"}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {isCompleted && !isCurrentLesson ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                  ) : (
                                    <span className="text-xs text-gray-500 mr-1">
                                      {modIndex + 1}.{lesIndex + 1}
                                    </span>
                                  )}
                                  {canAccess ? (
                                    <Link
                                      to={`/learning/lesson/${les.id}`}
                                      className={`text-sm ${isCurrentLesson ? "font-medium text-purple-700" : "text-gray-700 hover:text-purple-700"}`}
                                    >
                                      {les.title}
                                    </Link>
                                  ) : (
                                    <span className="text-sm text-gray-400">
                                      {les.title}
                                    </span>
                                  )}
                                </div>
                                {!canAccess && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-gray-400"
                                  >
                                    Terkunci
                                  </Badge>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
