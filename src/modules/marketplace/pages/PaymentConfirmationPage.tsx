import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Copy,
  Upload,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PaymentConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from("marketplace_orders")
          .select(
            "*, buyer:buyer_id(*), seller:seller_id(*), product:product_id(*)",
          )
          .eq("id", orderId)
          .single();

        if (orderError) throw orderError;

        // Check if user is the buyer
        if (orderData.buyer_id !== user.id) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You don't have permission to view this order.",
          });
          navigate("/marketplace");
          return;
        }

        setOrder(orderData);

        // Fetch payment info
        const { data: paymentData, error: paymentError } = await supabase
          .from("marketplace_payment_info")
          .select("*")
          .eq("is_active", true)
          .single();

        if (paymentError) throw paymentError;
        setPaymentInfo(paymentData);
      } catch (error: any) {
        console.error("Error fetching order details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load order details. Please try again.",
        });
        navigate("/marketplace");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, orderId, navigate, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProof(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentProof) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload proof of payment.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would upload the file to storage
      // For this demo, we'll just update the order with a placeholder URL
      const paymentProofUrl = "https://example.com/payment-proof.jpg";

      // Update order with payment proof
      const { error } = await supabase
        .from("marketplace_orders")
        .update({
          payment_proof: paymentProofUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Payment Confirmation Submitted",
        description:
          "Your payment confirmation has been submitted and is awaiting verification.",
      });

      // Navigate to order details page
      navigate(`/marketplace/orders/${orderId}`);
    } catch (error: any) {
      console.error("Error submitting payment confirmation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "Failed to submit payment confirmation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/marketplace"
            className="flex items-center text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Marketplace
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-purple-800 mb-6">
          Konfirmasi Pembayaran
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Instructions */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instruksi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Penting</AlertTitle>
                  <AlertDescription>
                    Silakan transfer sesuai dengan jumlah yang tertera ke
                    rekening berikut. Setelah transfer, unggah bukti pembayaran
                    untuk diverifikasi oleh admin.
                  </AlertDescription>
                </Alert>

                {paymentInfo && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Bank:</div>
                      <div className="flex items-center">
                        {paymentInfo.bank_name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={() => copyToClipboard(paymentInfo.bank_name)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="font-medium">No. Rekening:</div>
                      <div className="flex items-center">
                        {paymentInfo.account_number}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={() =>
                            copyToClipboard(paymentInfo.account_number)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="font-medium">Atas Nama:</div>
                      <div className="flex items-center">
                        {paymentInfo.account_name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={() =>
                            copyToClipboard(paymentInfo.account_name)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="font-medium">Jumlah Transfer:</div>
                      <div className="flex items-center font-bold text-purple-700">
                        {formatPrice(order.total_amount)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={() =>
                            copyToClipboard(order.total_amount.toString())
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Catatan:</span> Pastikan
                        untuk transfer tepat sesuai jumlah di atas untuk
                        memudahkan verifikasi. Pembayaran akan diverifikasi
                        dalam 1x24 jam kerja.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Unggah Bukti Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!paymentProofPreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Klik atau seret file bukti pembayaran di sini
                      </p>
                      <p className="text-xs text-gray-400">
                        Format: JPG, PNG, atau PDF (Maks. 5MB)
                      </p>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="payment-proof"
                        onChange={handleFileChange}
                      />
                      <Label
                        htmlFor="payment-proof"
                        className="mt-4 bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md cursor-pointer"
                      >
                        Pilih File
                      </Label>
                    </div>
                  ) : (
                    <div className="relative border rounded-md overflow-hidden">
                      <img
                        src={paymentProofPreview}
                        alt="Payment Proof"
                        className="w-full max-h-80 object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-purple-700 hover:bg-purple-800"
                    disabled={!paymentProof || isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Konfirmasi Pembayaran"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order && order.product && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={
                            order.product.images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={order.product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{order.product.title}</h3>
                        <p className="text-sm text-gray-500">
                          {order.product.brand} · {order.product.size}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Harga ({order.quantity} item)</span>
                        <span>
                          {formatPrice(order.product.price * order.quantity)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ongkos Kirim</span>
                        <span>Gratis</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Biaya Layanan</span>
                        <span>Gratis</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(order.total_amount)}</span>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">Status Pesanan:</p>
                          <p>Menunggu Pembayaran</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
