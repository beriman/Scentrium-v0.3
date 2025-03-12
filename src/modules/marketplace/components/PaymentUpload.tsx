import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { Upload, X, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentUploadProps {
  orderId: string;
  totalAmount: number;
  onPaymentUploaded: () => void;
}

export default function PaymentUpload({
  orderId,
  totalAmount,
  onPaymentUploaded,
}: PaymentUploadProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(
    null,
  );

  // Bank account information (in a real app, this would come from the database)
  const bankInfo = {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountName: "Scentrium Marketplace",
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
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("User not authenticated");

      // Upload payment proof to storage
      const fileExt = paymentProof.name.split(".").pop();
      const fileName = `${userData.user.id}-${orderId}-${Date.now()}.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, paymentProof);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);

      // Update order with payment proof
      const { error } = await supabase
        .from("marketplace_orders")
        .update({
          payment_proof: publicUrl,
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Payment Proof Uploaded",
        description:
          "Your payment proof has been uploaded and is awaiting verification.",
      });

      // Call the callback
      onPaymentUploaded();
    } catch (error: any) {
      console.error("Error uploading payment proof:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to upload payment proof. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Payment Proof</CardTitle>
        <CardDescription>
          Please transfer the exact amount and upload your payment proof
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Bank:</div>
              <div className="flex items-center">
                {bankInfo.bankName}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => copyToClipboard(bankInfo.bankName)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="font-medium">Account Number:</div>
              <div className="flex items-center">
                {bankInfo.accountNumber}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => copyToClipboard(bankInfo.accountNumber)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="font-medium">Account Name:</div>
              <div className="flex items-center">
                {bankInfo.accountName}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => copyToClipboard(bankInfo.accountName)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="font-medium">Amount to Transfer:</div>
              <div className="flex items-center font-bold text-purple-700">
                {formatPrice(totalAmount)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => copyToClipboard(totalAmount.toString())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <AlertDescription className="text-sm text-blue-700">
              Please make sure to transfer the exact amount to help us verify
              your payment faster. Include your Order ID (
              {orderId.substring(0, 8)}) in the transfer description.
            </AlertDescription>
          </div>
        </Alert>

        <form onSubmit={handleSubmit}>
          {!paymentProofPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Click or drag file to upload payment proof
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, or PDF (Max 5MB)
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
                Select File
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
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-purple-700 hover:bg-purple-800"
          onClick={handleSubmit}
          disabled={!paymentProof || isSubmitting}
        >
          {isSubmitting ? "Uploading..." : "Submit Payment Proof"}
        </Button>
      </CardFooter>
    </Card>
  );
}
