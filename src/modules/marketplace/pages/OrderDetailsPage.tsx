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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Truck,
  Package,
  MessageSquare,
  Star,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewDialog, setShowReviewDialog] = useState(false);

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

        // Check if user is the buyer or seller
        if (orderData.buyer_id !== user.id && orderData.seller_id !== user.id) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You don't have permission to view this order.",
          });
          navigate("/marketplace");
          return;
        }

        setOrder(orderData);
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

    // Set up real-time subscription for order updates
    const orderSubscription = supabase
      .channel("order-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "marketplace_orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prevOrder: any) => ({
            ...prevOrder,
            ...payload.new,
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [user, orderId, navigate, toast]);

  const handleShipOrder = async () => {
    if (!trackingNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a tracking number.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("marketplace_orders")
        .update({
          status: "shipped",
          tracking_number: trackingNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Order Shipped",
        description: "The order has been marked as shipped.",
      });
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update order status. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelivery = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("marketplace_orders")
        .update({
          status: "delivered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Delivery Confirmed",
        description: "You have confirmed receipt of the order.",
      });

      setShowReviewDialog(true);
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update order status. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("marketplace_orders")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Order Completed",
        description: "The order has been marked as completed.",
      });
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update order status. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a review comment.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create review
      const { error: reviewError } = await supabase
        .from("marketplace_reviews")
        .insert({
          order_id: orderId,
          product_id: order.product_id,
          buyer_id: user?.id,
          seller_id: order.seller_id,
          rating: reviewRating,
          comment: reviewComment,
        });

      if (reviewError) throw reviewError;

      // Complete the order
      await handleCompleteOrder();

      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully.",
      });

      setShowReviewDialog(false);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to submit review. Please try again.",
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Menunggu Pembayaran
          </Badge>
        );
      case "payment_confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Pembayaran Dikonfirmasi
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Dikirim
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Diterima
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500 text-white">
            Selesai
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const isBuyer = user?.id === order?.buyer_id;
  const isSeller = user?.id === order?.seller_id;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to={isBuyer ? "/marketplace/orders" : "/marketplace/lapak"}
            className="flex items-center text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isBuyer ? "Kembali ke Pesanan Saya" : "Kembali ke Lapak"}
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-800">
            Detail Pesanan #{orderId?.substring(0, 8)}
          </h1>
          {getStatusBadge(order?.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden">
                    <img
                      src={
                        order?.product?.images?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt={order?.product?.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{order?.product?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {order?.product?.brand} · {order?.product?.size} ·{" "}
                      {order?.product?.condition}
                    </p>
                    <p className="text-sm mt-1">
                      Jumlah:{" "}
                      <span className="font-medium">{order?.quantity}</span>
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID Pesanan</p>
                    <p className="font-medium">{orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                    <p className="font-medium">
                      {formatDate(order?.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status Pembayaran</p>
                    <p className="font-medium">
                      {order?.payment_status === "paid"
                        ? "Dibayar"
                        : "Belum Dibayar"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Metode Pengiriman</p>
                    <p className="font-medium">
                      {order?.shipping_method === "regular"
                        ? "Reguler (2-3 hari)"
                        : order?.shipping_method === "express"
                          ? "Express (1-2 hari)"
                          : order?.shipping_method === "same_day"
                            ? "Same Day"
                            : order?.shipping_method}
                    </p>
                  </div>
                </div>

                {order?.tracking_number && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium text-blue-700">
                          Informasi Pengiriman
                        </p>
                        <p className="text-sm text-blue-600">
                          Nomor Resi:{" "}
                          <span className="font-medium">
                            {order.tracking_number}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alamat Pengiriman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{order?.shipping_address}</p>
              </CardContent>
            </Card>

            {/* Seller Actions */}
            {isSeller && order?.status === "payment_confirmed" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" /> Kirim Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Pembayaran Dikonfirmasi</AlertTitle>
                    <AlertDescription>
                      Pembayaran telah dikonfirmasi. Silakan kirim pesanan dan
                      masukkan nomor resi pengiriman.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="tracking-number">Nomor Resi</Label>
                    <Input
                      id="tracking-number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Masukkan nomor resi pengiriman"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-purple-700 hover:bg-purple-800"
                    onClick={handleShipOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Memproses..." : "Konfirmasi Pengiriman"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Buyer Actions */}
            {isBuyer && order?.status === "shipped" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" /> Konfirmasi Penerimaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Pesanan Telah Dikirim</AlertTitle>
                    <AlertDescription>
                      Pesanan telah dikirim oleh penjual. Jika Anda telah
                      menerima pesanan dan sesuai dengan deskripsi, silakan
                      konfirmasi penerimaan.
                    </AlertDescription>
                  </Alert>

                  {order?.tracking_number && (
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                      <div className="flex items-start">
                        <Truck className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium text-blue-700">
                            Informasi Pengiriman
                          </p>
                          <p className="text-sm text-blue-600">
                            Nomor Resi:{" "}
                            <span className="font-medium">
                              {order.tracking_number}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-purple-700 hover:bg-purple-800"
                    onClick={handleConfirmDelivery}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Memproses..." : "Konfirmasi Penerimaan"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Review Dialog */}
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Berikan Ulasan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex justify-center">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="Bagikan pengalaman Anda dengan produk ini..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    required
                  />

                  <Button
                    className="w-full bg-purple-700 hover:bg-purple-800"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Ringkasan Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order?.total_amount)}</span>
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
                  <span>{formatPrice(order?.total_amount)}</span>
                </div>

                {/* Order Status Timeline */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Status Pesanan</h3>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${order?.status !== "cancelled" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Pesanan Dibuat</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order?.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${["payment_confirmed", "shipped", "delivered", "completed"].includes(order?.status) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Pembayaran Dikonfirmasi</p>
                        {[
                          "payment_confirmed",
                          "shipped",
                          "delivered",
                          "completed",
                        ].includes(order?.status) && (
                          <p className="text-xs text-gray-500">
                            Dikonfirmasi oleh Admin
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${["shipped", "delivered", "completed"].includes(order?.status) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Pesanan Dikirim</p>
                        {order?.tracking_number &&
                          ["shipped", "delivered", "completed"].includes(
                            order?.status,
                          ) && (
                            <p className="text-xs text-gray-500">
                              Resi: {order.tracking_number}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${["delivered", "completed"].includes(order?.status) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Pesanan Diterima</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${order?.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Transaksi Selesai</p>
                        {order?.status === "completed" && (
                          <p className="text-xs text-gray-500">
                            Dana diteruskan ke penjual
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Seller/Buyer */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Hubungi {isBuyer ? "Penjual" : "Pembeli"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
