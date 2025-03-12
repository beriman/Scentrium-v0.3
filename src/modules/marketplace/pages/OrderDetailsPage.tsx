import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Truck,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";
import PaymentUpload from "../components/PaymentUpload";
import OrderTracking from "../components/OrderTracking";
import ProductReviews from "../components/ProductReviews";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("marketplace_orders")
          .select("*, product:product_id(*), seller:seller_id(*)")
          .eq("id", orderId)
          .single();

        if (error) throw error;

        // Check if user is the buyer
        if (data.buyer_id !== user.id) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You don't have permission to view this order.",
          });
          navigate("/marketplace/my-orders");
          return;
        }

        setOrder(data);
      } catch (error: any) {
        console.error("Error fetching order details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load order details. Please try again.",
        });
        navigate("/marketplace/my-orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();

    // Set up real-time subscription for order updates
    const orderSubscription = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "marketplace_orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prevOrder: any) => ({ ...prevOrder, ...payload.new }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [orderId, user, navigate, toast, refreshTrigger]);

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

  const handlePaymentUploaded = () => {
    // Refresh the order data
    setRefreshTrigger((prev) => prev + 1);
  };

  // Check if user can review the product
  const canReviewProduct = () => {
    if (!order) return false;
    return ["delivered", "completed"].includes(order.status);
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
          to="/marketplace/my-orders"
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-800 mb-2 flex items-center gap-2">
            <Package className="h-6 w-6" /> Order Details
          </h1>
          <p className="text-gray-600">
            Order ID: {order.id.substring(0, 8)} | Placed on{" "}
            {formatDate(order.created_at)}
          </p>
        </div>
        <Badge
          className={
            order.status === "completed"
              ? "bg-green-100 text-green-800 border-green-200"
              : order.status === "cancelled"
                ? "bg-red-100 text-red-800 border-red-200"
                : order.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
          }
        >
          {order.status === "payment_confirmed"
            ? "Payment Confirmed"
            : order.status === "shipped"
              ? "Shipped"
              : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order Tracking */}
          <OrderTracking order={order} />

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-purple-600" /> Product
                Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-24 h-24 bg-gray-100 flex-shrink-0">
                  <img
                    src={
                      order.product?.images?.[0] ||
                      "https://via.placeholder.com/150"
                    }
                    alt={order.product?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-1">
                    {order.product?.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Seller: {order.seller?.full_name}
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Quantity: {order.quantity} ×{" "}
                        {formatPrice(order.product?.price)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-purple-700">
                        {formatPrice(order.product?.price * order.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" /> Shipping
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Shipping Address
                  </h3>
                  <p className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                    {order.shipping_address}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Contact Number
                  </h3>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-1" />
                    {order.shipping_phone}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Shipping Method
                </h3>
                <p>
                  {order.shipping_method === "express"
                    ? "Express Shipping (1 day)"
                    : "Regular Shipping (2-3 days)"}
                </p>
              </div>
              {order.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Order Notes
                  </h3>
                  <p>{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Upload Section - Only show if order is pending */}
          {order.status === "pending" && !order.payment_proof && (
            <PaymentUpload
              orderId={order.id}
              totalAmount={order.total_amount}
              onPaymentUploaded={handlePaymentUploaded}
            />
          )}

          {/* Product Review Section - Only show if order is delivered/completed */}
          {canReviewProduct() && (
            <ProductReviews productId={order.product_id} canReview={true} />
          )}
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {formatPrice(order.product?.price * order.quantity)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {formatPrice(
                      order.shipping_method === "express" ? 50000 : 20000,
                    )}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Payment Method</h3>
                <p>
                  {order.payment_method === "bank_transfer"
                    ? "Bank Transfer"
                    : order.payment_method}
                </p>
                <p className="text-sm text-gray-500">
                  {order.status === "pending" && !order.payment_proof
                    ? "Awaiting Payment"
                    : order.status === "pending" && order.payment_proof
                      ? "Payment Verification in Progress"
                      : order.status === "payment_confirmed"
                        ? "Payment Confirmed"
                        : order.status === "shipped"
                          ? "Shipped"
                          : order.status === "delivered" ||
                              order.status === "completed"
                            ? "Completed"
                            : order.status === "cancelled"
                              ? "Cancelled"
                              : ""}
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <Link to={`/marketplace/product/${order.product_id}`}>
                  <Button
                    variant="outline"
                    className="w-full text-purple-700 border-purple-200"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> View Product
                  </Button>
                </Link>

                {/* Contact Seller button */}
                <Button
                  variant="outline"
                  className="w-full text-purple-700 border-purple-200"
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
