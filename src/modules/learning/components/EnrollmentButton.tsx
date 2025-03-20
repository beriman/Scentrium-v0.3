import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { Lock, Play, CheckCircle } from "lucide-react";

interface EnrollmentButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isFree?: boolean;
  onEnrollmentChange?: (isEnrolled: boolean) => void;
}

export default function EnrollmentButton({
  courseId,
  courseTitle,
  price,
  isFree = false,
  onEnrollmentChange,
}: EnrollmentButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    "none" | "pending" | "approved" | "rejected"
  >("none");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course.",
      });
      return;
    }

    if (isFree) {
      setIsLoading(true);
      try {
        // For free courses, directly create an approved enrollment
        const { error } = await supabase.from("learning_enrollments").insert({
          user_id: user.id,
          course_id: courseId,
          status: "approved",
          payment_amount: 0,
          payment_date: new Date().toISOString(),
        });

        if (error) throw error;

        setIsEnrolled(true);
        setEnrollmentStatus("approved");
        if (onEnrollmentChange) {
          onEnrollmentChange(true);
        }

        toast({
          title: "Enrolled Successfully",
          description: `You are now enrolled in ${courseTitle}.`,
        });
      } catch (error: any) {
        console.error("Error enrolling in course:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to enroll in course. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // For paid courses, show payment dialog
      setShowPaymentDialog(true);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentDialog(false);
    setEnrollmentStatus("pending");
    if (onEnrollmentChange) {
      onEnrollmentChange(false); // Still not enrolled until approved
    }
  };

  if (isLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (isEnrolled) {
    return (
      <Button className="bg-green-600 hover:bg-green-700">
        <CheckCircle className="mr-2 h-4 w-4" /> Enrolled
      </Button>
    );
  }

  if (enrollmentStatus === "pending") {
    return (
      <Button
        disabled
        className="bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed"
      >
        Payment Pending Approval
      </Button>
    );
  }

  if (enrollmentStatus === "rejected") {
    return (
      <Button variant="destructive" onClick={() => setShowPaymentDialog(true)}>
        Payment Rejected - Try Again
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleEnroll}
        className="bg-purple-700 hover:bg-purple-800"
      >
        {isFree ? (
          <>
            <Play className="mr-2 h-4 w-4" /> Enroll for Free
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" /> Enroll for {formatPrice(price)}
          </>
        )}
      </Button>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll in {courseTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>To complete your enrollment, please follow these steps:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Transfer the payment of {formatPrice(price)} to our account
              </li>
              <li>Upload your payment receipt</li>
              <li>Wait for admin verification (usually within 24 hours)</li>
            </ol>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">
                Bank Transfer Details
              </h4>
              <p className="text-sm text-blue-700">Bank: BCA</p>
              <p className="text-sm text-blue-700">Account: 1234567890</p>
              <p className="text-sm text-blue-700">Name: Scentrium Indonesia</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button className="bg-purple-700" onClick={handlePaymentComplete}>
                I've Made the Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Format price to IDR
function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
