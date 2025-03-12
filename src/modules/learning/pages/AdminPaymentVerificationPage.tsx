import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Clock,
  Filter,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminPaymentVerificationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    // Check if user is admin (in a real app, you would check admin role)
    // For this demo, we'll assume any user can access this page
    // In production, you should implement proper admin role checks
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const { data, error } = await supabase
          .from("learning_enrollments")
          .select("*, user:user_id(*), course:course_id(*)")
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
      .channel("enrollments-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "learning_enrollments",
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
      enrollment.user?.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      enrollment.id?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "pending") {
      return (
        matchesSearch &&
        enrollment.payment_status === "unpaid" &&
        enrollment.payment_proof
      );
    }
    if (activeTab === "verified") {
      return matchesSearch && enrollment.payment_status === "paid";
    }
    if (activeTab === "all") {
      return matchesSearch;
    }

    return matchesSearch;
  });

  const handleVerifyPayment = async (enrollmentId: string) => {
    setIsProcessing(true);

    try {
      // Call the edge function to verify payment
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-process-course-enrollment",
        {
          body: {
            action: "confirm_payment",
            enrollmentId: enrollmentId,
            adminNotes: adminNotes || "Payment verified by admin",
          },
        },
      );

      if (error) throw error;

      toast({
        title: "Payment Verified",
        description:
          "The payment has been verified and the user now has access to the course.",
      });

      setSelectedEnrollment(null);
      setAdminNotes("");
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to verify payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageDialog(true);
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        Verifikasi Pembayaran Kursus
      </h1>
      <p className="text-gray-600 mb-6">
        Kelola dan verifikasi pembayaran kursus dari pengguna
      </p>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama kursus, nama pengguna, atau ID..."
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
              <TabsTrigger value="pending">Menunggu Verifikasi</TabsTrigger>
              <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
              <TabsTrigger value="all">Semua</TabsTrigger>
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

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kursus
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pengguna
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Harga
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bukti
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.course?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.user?.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(enrollment.course?.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.payment_status === "paid" ? (
                        <Badge className="bg-green-100 text-green-800">
                          Terverifikasi
                        </Badge>
                      ) : enrollment.payment_proof ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Menunggu Verifikasi
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Belum Bayar
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.payment_proof ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() =>
                            handleViewImage(enrollment.payment_proof)
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" /> Lihat
                        </Button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollment.payment_status === "unpaid" &&
                        enrollment.payment_proof && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-purple-700 border-purple-200"
                            onClick={() => setSelectedEnrollment(enrollment)}
                          >
                            Verifikasi
                          </Button>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    Tidak ada data pendaftaran yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Dialog */}
      {selectedEnrollment && (
        <Dialog
          open={!!selectedEnrollment}
          onOpenChange={() => setSelectedEnrollment(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verifikasi Pembayaran</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ID Pendaftaran:</span>
                  <span className="font-medium">{selectedEnrollment.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Kursus:</span>
                  <span className="font-medium">
                    {selectedEnrollment.course?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pengguna:</span>
                  <span className="font-medium">
                    {selectedEnrollment.user?.full_name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Jumlah:</span>
                  <span className="font-medium">
                    {formatPrice(selectedEnrollment.course?.price)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Catatan Admin (Opsional)</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pendaftaran ini"
                  rows={3}
                />
              </div>

              <div className="flex justify-between space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEnrollment(null)}
                  disabled={isProcessing}
                >
                  Batal
                </Button>
                <Button
                  className="bg-purple-700 hover:bg-purple-800"
                  onClick={() => handleVerifyPayment(selectedEnrollment.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Memproses..." : "Verifikasi Pembayaran"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <img
              src={selectedImage}
              alt="Payment Proof"
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
