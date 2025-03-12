import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { ArrowLeft, ShoppingCart, CheckCircle } from "lucide-react";
import CheckoutProcess from "../components/CheckoutProcess";

export default function CheckoutPage() {
  const { productId, quantity: quantityParam } = useParams<{
    productId: string;
    quantity: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "You must be logged in to checkout",
      });
      navigate("/login", {
        state: { from: `/marketplace/product/${productId}` },
      });
      return;
    }

    // Parse quantity from URL parameter
    if (quantityParam) {
      const parsedQuantity = parseInt(quantityParam, 10);
      if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
        setQuantity(parsedQuantity);
      }
    }

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("marketplace_products")
          .select("*, seller:seller_id(*)")
          .eq("id", productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error: any) {
        console.error("Error fetching product:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to load product. Please try again.",
        });
        navigate("/marketplace");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, quantityParam, user, navigate, toast]);

  const handleCheckoutComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCheckoutComplete(true);
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

  if (checkoutComplete && orderId) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your order has been placed successfully. You can track your order
              status and complete the payment process from your order details
              page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link to={`/marketplace/order/${orderId}`}>
                <Button className="bg-purple-700 hover:bg-purple-800">
                  View Order Details
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          to={`/marketplace/product/${productId}`}
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Checkout
        </h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      {product && (
        <CheckoutProcess
          product={product}
          quantity={quantity}
          onCheckoutComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
}
