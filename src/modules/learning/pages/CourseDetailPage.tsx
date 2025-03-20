import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  User,
  CheckCircle,
  Play,
  ShoppingBag,
  Award,
  Star,
} from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [previewLesson, setPreviewLesson] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from("learning_courses")
          .select("*, instructor:instructor_id(*)")
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch modules and lessons
        const { data: modulesData, error: modulesError } = await supabase
          .from("learning_modules")
          .select("*, lessons:learning_lessons(*)")
          .eq("course_id", courseId)
          .order("order_number", { ascending: true });

        if (modulesError) throw modulesError;

        // Sort lessons by order_number
        const sortedModules = modulesData.map((module) => ({
          ...module,
          lessons: module.lessons.sort(
            (a: any, b: any) => a.order_number - b.order_number,
          ),
        }));

        setModules(sortedModules);

        // Find a preview lesson
        const previewLesson = sortedModules
          .flatMap((module) => module.lessons)
          .find((lesson: any) => lesson.is_preview);

        setPreviewLesson(previewLesson);

        // Collect related product IDs
        const productIds = sortedModules
          .flatMap((module) => module.lessons)
          .filter((lesson: any) => lesson.related_product_id)
          .map((lesson: any) => lesson.related_product_id);

        // Fetch related products if any
        if (productIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from("marketplace_products")
            .select("*")
            .in("id", productIds);

          if (!productsError) {
            setRelatedProducts(productsData || []);
          }
        }

        // Check if user is enrolled
        if (user) {
          const { data: enrollmentData, error: enrollmentError } =
            await supabase
              .from("learning_enrollments")
              .select("*")
              .eq("user_id", user.id)
              .eq("course_id", courseId)
              .single();

          if (!enrollmentError) {
            setIsEnrolled(true);
            setEnrollment(enrollmentData);
          }
        }
      } catch (error: any) {
        console.error("Error fetching course details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load course details. Please try again.",
        });
        navigate("/learning");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, user, navigate, toast]);

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course.",
      });
      navigate("/login", { state: { from: `/learning/course/${courseId}` } });
      return;
    }

    setIsEnrolling(true);

    try {
      // Create enrollment
      const { data: enrollment, error } = await supabase
        .from("learning_enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: "active",
          payment_status: "unpaid",
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to payment page
      navigate(`/learning/payment/${enrollment.id}`);

      toast({
        title: "Enrollment Started",
        description: "Please complete the payment to access the course.",
      });
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to enroll in course. Please try again.",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          to="/learning"
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Pembelajaran
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200"
              >
                <Clock className="mr-1 h-4 w-4" />
                {formatDuration(course.duration_minutes)}
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <BookOpen className="mr-1 h-4 w-4" />
                {modules.reduce(
                  (total, module) => total + module.lessons.length,
                  0,
                )}{" "}
                Pelajaran
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <User className="mr-1 h-4 w-4" />
                {getLevelLabel(course.level)}
              </Badge>
            </div>

            {/* Preview Video */}
            {previewLesson && (
              <div className="mb-6">
                <VideoPlayer
                  videoUrl={previewLesson.video_url}
                  lessonId={previewLesson.id}
                  isPreview={true}
                  isEnrolled={isEnrolled}
                  thumbnailUrl={course.thumbnail_url}
                />
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
              <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Tentang Kursus Ini
                </h2>
                <p className="text-gray-600">{course.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Yang Akan Dipelajari
                </h2>
                <ul className="space-y-2">
                  {modules.map((module) => (
                    <li key={module.id} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{module.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {relatedProducts.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Kit Pembelajaran
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedProducts.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <img
                              src={
                                product.images?.[0] ||
                                "https://via.placeholder.com/150"
                              }
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-gray-500">
                              {product.brand} · {product.size}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-bold text-purple-700">
                                {formatPrice(product.price)}
                              </span>
                              <Link to={`/marketplace/product/${product.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-purple-700 border-purple-200"
                                >
                                  <ShoppingBag className="h-4 w-4 mr-1" /> Beli
                                  Kit
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold mb-3">Instruktur</h2>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor?.full_name}`}
                      alt={course.instructor?.full_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {course.instructor?.full_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.instructor?.bio || "Perfumer & Instructor"}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="pt-4">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-3">Konten Kursus</h2>

                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <Card key={module.id}>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-lg">
                          Module {moduleIndex + 1}: {module.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 px-4">
                        <ul className="divide-y">
                          {module.lessons.map(
                            (lesson: any, lessonIndex: number) => (
                              <li
                                key={lesson.id}
                                className="py-3 flex justify-between items-center"
                              >
                                <div className="flex items-center">
                                  <div className="mr-3 text-gray-500">
                                    {moduleIndex + 1}.{lessonIndex + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {lesson.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatDuration(lesson.duration_minutes)}
                                    </div>
                                  </div>
                                </div>
                                {lesson.is_preview ? (
                                  <Link
                                    to={`/learning/lesson/${lesson.id}`}
                                    className="flex items-center text-purple-700 hover:text-purple-900"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    <span>Preview</span>
                                  </Link>
                                ) : isEnrolled &&
                                  enrollment?.payment_status === "paid" ? (
                                  <Link
                                    to={`/learning/lesson/${lesson.id}`}
                                    className="flex items-center text-purple-700 hover:text-purple-900"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    <span>Tonton</span>
                                  </Link>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-gray-500"
                                  >
                                    Terkunci
                                  </Badge>
                                )}
                              </li>
                            ),
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full aspect-video object-cover rounded-md mb-4"
              />

              <div className="text-3xl font-bold text-purple-800 mb-4">
                {formatPrice(course.price)}
              </div>

              {isEnrolled ? (
                enrollment?.payment_status === "paid" ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-md border border-green-200">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium text-green-700">
                            Sudah Terdaftar
                          </p>
                          <p className="text-sm text-green-600">
                            Anda memiliki akses penuh ke kursus ini
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link to={`/learning/my-courses`}>
                      <Button className="w-full bg-purple-700 hover:bg-purple-800">
                        Lanjutkan Belajar
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium text-yellow-700">
                            Menunggu Pembayaran
                          </p>
                          <p className="text-sm text-yellow-600">
                            Silakan selesaikan pembayaran untuk mengakses kursus
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link to={`/learning/payment/${enrollment.id}`}>
                      <Button className="w-full bg-purple-700 hover:bg-purple-800">
                        Selesaikan Pembayaran
                      </Button>
                    </Link>
                  </div>
                )
              ) : (
                <Button
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? "Memproses..." : "Daftar Kursus"}
                </Button>
              )}

              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">Kursus ini mencakup:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>
                      {formatDuration(course.duration_minutes)} konten video
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>
                      {modules.reduce(
                        (total, module) => total + module.lessons.length,
                        0,
                      )}{" "}
                      pelajaran
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Akses seumur hidup</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Sertifikat penyelesaian</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Lencana khusus</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>EXP untuk naik level</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex justify-center">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 flex items-center"
                >
                  <Award className="h-4 w-4 mr-1" /> Dapatkan Sertifikat
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
