import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, GraduationCap, Filter } from "lucide-react";
import { supabase } from "../../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import CourseCard from "../components/CourseCard";

export default function LearningHomePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("learning_courses")
          .select("*, instructor:instructor_id(full_name)")
          .eq("status", "published")
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load courses. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  // Filter courses based on search query, tab, and level
  const filteredCourses = courses.filter((course) => {
    // Filter by search query
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by level
    const matchesLevel = activeLevel ? course.level === activeLevel : true;

    // Filter by tab (all, featured)
    if (activeTab === "featured") {
      return matchesSearch && matchesLevel && course.is_featured;
    }

    return matchesSearch && matchesLevel;
  });

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Platform Pembelajaran
          </h1>
          <p className="text-gray-600">
            Tingkatkan pengetahuan dan keterampilan parfum Anda dengan kursus
            berkualitas
          </p>
        </div>
        <Link to="/learning/my-courses">
          <Button className="bg-purple-700 hover:bg-purple-800">
            <BookOpen className="mr-2 h-4 w-4" /> Kursus Saya
          </Button>
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari kursus..."
            className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700"
          >
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Filter</span>
          </Button>
        </div>
      </div>

      {/* Level filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge
          variant={activeLevel === null ? "default" : "outline"}
          className={`cursor-pointer ${activeLevel === null ? "bg-purple-700" : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"}`}
          onClick={() => setActiveLevel(null)}
        >
          Semua Level
        </Badge>
        <Badge
          variant={activeLevel === "beginner" ? "default" : "outline"}
          className={`cursor-pointer ${activeLevel === "beginner" ? "bg-purple-700" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}`}
          onClick={() => setActiveLevel("beginner")}
        >
          Pemula
        </Badge>
        <Badge
          variant={activeLevel === "intermediate" ? "default" : "outline"}
          className={`cursor-pointer ${activeLevel === "intermediate" ? "bg-purple-700" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}`}
          onClick={() => setActiveLevel("intermediate")}
        >
          Menengah
        </Badge>
        <Badge
          variant={activeLevel === "advanced" ? "default" : "outline"}
          className={`cursor-pointer ${activeLevel === "advanced" ? "bg-purple-700" : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"}`}
          onClick={() => setActiveLevel("advanced")}
        >
          Mahir
        </Badge>
      </div>

      {/* Featured courses section */}
      {activeTab === "all" && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-purple-800 flex items-center">
              <GraduationCap className="mr-2 h-6 w-6" /> Kursus Unggulan
            </h2>
            <Link
              to="/learning?tab=featured"
              className="text-purple-700 hover:text-purple-900 font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((course) => course.is_featured)
              .slice(0, 3)
              .map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  thumbnailUrl={course.thumbnail_url}
                  price={course.price}
                  level={course.level}
                  durationMinutes={course.duration_minutes}
                  instructorName={course.instructor?.full_name || "Instructor"}
                  isFeatured={course.is_featured}
                />
              ))}
          </div>
        </div>
      )}

      {/* All courses grid */}
      <div>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          {activeTab === "featured" ? "Kursus Unggulan" : "Semua Kursus"}
        </h2>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                thumbnailUrl={course.thumbnail_url}
                price={course.price}
                level={course.level}
                durationMinutes={course.duration_minutes}
                instructorName={course.instructor?.full_name || "Instructor"}
                isFeatured={course.is_featured}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Tidak ada kursus ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
