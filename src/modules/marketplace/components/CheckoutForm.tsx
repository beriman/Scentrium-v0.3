import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { Product } from "../types";
import { AlertCircle, CreditCard, Truck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CheckoutFormProps {
  product: Product;
  quantity: number;
  onCancel: () => void;
}

export default function CheckoutForm({
  product,
  quantity,
  onCancel,
}: CheckoutFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    shippingMethod: "regular",
    notes: "",
  });

  // Fetch payment information (admin bank account)
  const fetchPaymentInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_payment_info")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      setPaymentInfo(data);
    } catch (error) {
      console.error("Error fetching payment info:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load payment information. Please try again.",
      });
    }
  };

  // Load payment info on component mount
  useState(() => {
    fetchPaymentInfo();
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to place an order.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format shipping address
      const shippingAddress = `${formData.recipientName}\n${formData.phoneNumber}\n${formData.addressLine1}${formData.addressLine2 ? "\n" + formData.addressLine2 : ""}\n${formData.city}, ${formData.province} ${formData.postalCode}`;

      // Calculate total amount
      const totalAmount = product.price * quantity;

      // Create order
      const { data: order, error } = await supabase
        .from("marketplace_orders")
        .insert({
          buyer_id: user.id,
          seller_id: product.sellerId,
          product_id: product.id,
          quantity: quantity,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          shipping_method: formData.shippingMethod,
          status: "pending",
          payment_status: "unpaid",
        })
        .select()
        .single();

      if (error) throw error;

      // Save shipping address for future use
      await supabase.from("marketplace_shipping_addresses").insert({
        user_id: user.id,
        recipient_name: formData.recipientName,
        phone_number: formData.phoneNumber,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        is_default: false,
      });

      // Navigate to payment confirmation page
      navigate(`/marketplace/payment/${order.id}`);

      toast({
        title: "Order Created",
        description: "Your order has been created successfully.",
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to create order. Please try again.",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" /> Informasi Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Nama Penerima</Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Alamat</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Alamat Tambahan (Opsional)</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingMethod">Metode Pengiriman</Label>
                <Select
                  value={formData.shippingMethod}
                  onValueChange={(value) =>
                    handleSelectChange("shippingMethod", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pengiriman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Reguler (2-3 hari)</SelectItem>
                    <SelectItem value="express">Express (1-2 hari)</SelectItem>
                    <SelectItem value="same_day">Same Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tambahkan catatan untuk penjual"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Perhatian</AlertTitle>
                <AlertDescription>
                  Pembayaran dilakukan melalui transfer bank ke rekening bersama
                  Scentrium. Setelah checkout, Anda akan diarahkan ke halaman
                  konfirmasi pembayaran.
                </AlertDescription>
              </Alert>

              {paymentInfo && (
                <div className="space-y-2 border rounded-md p-4 bg-gray-50">
                  <p className="font-medium">Rekening Bersama Scentrium:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Bank:</div>
                    <div className="font-medium">{paymentInfo.bank_name}</div>
                    <div>No. Rekening:</div>
                    <div className="font-medium">
                      {paymentInfo.account_number}
                    </div>
                    <div>Atas Nama:</div>
                    <div className="font-medium">
                      {paymentInfo.account_name}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-sm text-gray-500">
                    {product.brand} · {product.size}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Harga ({quantity} item)</span>
                  <span>{formatPrice(product.price * quantity)}</span>
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
                <span>{formatPrice(product.price * quantity)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Checkout"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
