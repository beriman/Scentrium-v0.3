import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  Search,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const { data, error } = await supabase
          .from("learning_enrollments")
          .select("*, course:course_id(*), progress:learning_progress(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEnrollments(data || []);
      } catch (error: any) {
        console.error("Error fetching enrollments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load enrollments. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();

    // Set up real-time subscription for enrollment updates
    const enrollmentsSubscription = supabase
      .channel("my-enrollments-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "learning_enrollments",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchEnrollments();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(enrollmentsSubscription);
    };
  }, [user, navigate, toast]);

  // Filter enrollments based on search query and active tab
  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Filter by search query
    const matchesSearch =
      enrollment.course?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      enrollment.id?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "active") {
      return (
        matchesSearch &&
        enrollment.payment_status === "paid" &&
        enrollment.status === "active"
      );
    }
    if (activeTab === "completed") {
      return matchesSearch && enrollment.status === "completed";
    }
    if (activeTab === "pending") {
      return matchesSearch && enrollment.payment_status === "unpaid";
    }

    return matchesSearch;
  });

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Kursus Saya
          </h1>
          <p className="text-gray-600">
            Kelola dan akses kursus yang telah Anda daftar
          </p>
        </div>
        <Link to="/learning">
          <Button className="bg-purple-700 hover:bg-purple-800">
            <BookOpen className="mr-2 h-4 w-4" /> Jelajahi Kursus
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
              <TabsTrigger value="active">Aktif</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="pending">Menunggu</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <Card
              key={enrollment.id}
              className="overflow-hidden h-full flex flex-col"
            >
              <div className="relative">
                <img
                  src={enrollment.course?.thumbnail_url}
                  alt={enrollment.course?.title}
                  className="w-full aspect-video object-cover"
                />
                {enrollment.payment_status === "paid" ? (
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    Akses Penuh
                  </Badge>
                ) : (
                  <Badge className="absolute top-2 right-2 bg-yellow-600">
                    Menunggu Pembayaran
                  </Badge>
                )}
                {enrollment.status === "completed" && (
                  <Badge className="absolute top-2 left-2 bg-blue-600">
                    Selesai
                  </Badge>
                )}
              </div>
              <CardContent className="flex-1 p-4 flex flex-col">
                <Link to={`/learning/course/${enrollment.course?.id}`}>
                  <h3 className="text-lg font-semibold text-purple-800 hover:text-purple-600 mb-2">
                    {enrollment.course?.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {enrollment.course?.description}
                </p>

                <div className="mt-auto space-y-4">
                  {enrollment.payment_status === "paid" ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          Progress: {enrollment.progress_percentage}%
                        </span>
                      </div>
                      <Link to={`/learning/course/${enrollment.course?.id}`}>
                        <Button
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-800"
                        >
                          Lanjutkan
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-yellow-600">
                          Menunggu Pembayaran
                        </span>
                      </div>
                      <Link to={`/learning/payment/${enrollment.id}`}>
                        <Button
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-800"
                        >
                          Bayar
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Terdaftar pada: {formatDate(enrollment.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Belum ada kursus
          </h3>
          <p className="text-gray-500 mb-4">
            Anda belum mendaftar ke kursus apapun
          </p>
          <Link to="/learning">
            <Button className="bg-purple-700 hover:bg-purple-800">
              Jelajahi Kursus
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
