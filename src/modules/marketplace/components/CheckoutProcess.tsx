import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { CreditCard, Truck, MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CheckoutProcessProps {
  product: any;
  quantity: number;
  onCheckoutComplete: (orderId: string) => void;
}

export default function CheckoutProcess({
  product,
  quantity,
  onCheckoutComplete,
}: CheckoutProcessProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [shippingMethod, setShippingMethod] = useState("regular");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Calculate costs
  const productTotal = product.price * quantity;
  const shippingCost = shippingMethod === "express" ? 50000 : 20000;
  const totalAmount = productTotal + shippingCost;

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to checkout",
      });
      navigate("/login");
      return;
    }

    if (!address || !city || !postalCode || !phone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required shipping information",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const { data: order, error } = await supabase
        .from("marketplace_orders")
        .insert({
          buyer_id: user.id,
          seller_id: product.seller_id,
          product_id: product.id,
          quantity: quantity,
          total_amount: totalAmount,
          status: "pending",
          payment_method: paymentMethod,
          shipping_method: shippingMethod,
          shipping_address: `${address}, ${city}, ${postalCode}`,
          shipping_phone: phone,
          notes: notes,
          tracking_number: null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update product stock
      const { error: stockError } = await supabase
        .from("marketplace_products")
        .update({ stock: product.stock - quantity })
        .eq("id", product.id);

      if (stockError) {
        console.error("Error updating stock:", stockError);
      }

      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed",
      });

      // Call the callback with the order ID
      onCheckoutComplete(order.id);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to place order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" /> Shipping
              Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postal Code *</Label>
                    <Input
                      id="postal-code"
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions for your order"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" /> Shipping Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={shippingMethod}
              onValueChange={setShippingMethod}
              className="space-y-3"
            >
              <div className="flex items-center justify-between space-x-2 border rounded-md p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular" className="cursor-pointer">
                    Regular Shipping (2-3 days)
                  </Label>
                </div>
                <div className="font-medium">{formatPrice(20000)}</div>
              </div>
              <div className="flex items-center justify-between space-x-2 border rounded-md p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="cursor-pointer">
                    Express Shipping (1 day)
                  </Label>
                </div>
                <div className="font-medium">{formatPrice(50000)}</div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" /> Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="cursor-pointer">
                  Bank Transfer (Manual Verification)
                </Label>
              </div>
            </RadioGroup>

            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                After placing your order, you will need to transfer the payment
                to our account and upload the proof of payment.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{product.title}</h3>
                <p className="text-sm text-gray-500">
                  Quantity: {quantity} × {formatPrice(product.price)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(productTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-800"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
