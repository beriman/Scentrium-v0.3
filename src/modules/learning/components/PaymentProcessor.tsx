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
import { useAuth } from "../../../../supabase/auth";
import { Upload, X, Copy, CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentProcessorProps {
  courseId: string;
  courseTitle: string;
  price: number;
  onPaymentComplete: () => void;
}

export default function PaymentProcessor({
  courseId,
  courseTitle,
  price,
  onPaymentComplete,
}: PaymentProcessorProps) {
  const { user } = useAuth();
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
    accountName: "Scentrium Learning",
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
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to purchase this course.",
      });
      return;
    }

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
      // Upload payment proof to storage
      const fileExt = paymentProof.name.split(".").pop();
      const fileName = `${user.id}-${courseId}-${Date.now()}.${fileExt}`;
      const filePath = `course-payments/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("course-payments")
        .upload(filePath, paymentProof);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("course-payments").getPublicUrl(filePath);

      // Create enrollment record
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("learning_enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: "pending", // pending, approved, rejected
          payment_proof: publicUrl,
          payment_amount: price,
          payment_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (enrollmentError) throw enrollmentError;

      toast({
        title: "Payment Submitted",
        description:
          "Your payment is being processed. We'll notify you once it's approved.",
      });

      // Call the callback
      onPaymentComplete();
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to process payment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Course Access</CardTitle>
        <CardDescription>
          Complete your payment to access {courseTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Course Price:</span>
            <span className="font-bold text-purple-700">
              {formatPrice(price)}
            </span>
          </div>
          <p className="text-sm text-purple-700">
            This is a one-time payment for lifetime access to this course.
          </p>
        </div>

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
                {formatPrice(price)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => copyToClipboard(price.toString())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <AlertDescription className="text-sm text-blue-700">
              Please make sure to transfer the exact amount to help us verify
              your payment faster. Include your email address in the transfer
              description.
            </AlertDescription>
          </div>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2 mb-4">
            <Label htmlFor="payment-proof">Upload Payment Proof</Label>
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
          </div>

          <Alert className="bg-yellow-50 border-yellow-200 mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              Your access will be granted after our team verifies your payment
              (usually within 24 hours).
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-purple-700 hover:bg-purple-800"
          onClick={handleSubmit}
          disabled={!paymentProof || isSubmitting}
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" /> Submit Payment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
