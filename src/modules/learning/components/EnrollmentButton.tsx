import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { Lock, Play, CheckCircle } from "lucide-react";
import PaymentProcessor from "./PaymentProcessor";

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

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("learning_enrollments")
          .select("status")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 means no rows returned
          throw error;
        }

        if (data) {
          setEnrollmentStatus(data.status);
          setIsEnrolled(data.status === "approved");
          if (onEnrollmentChange) {
            onEnrollmentChange(data.status === "approved");
          }
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnrollmentStatus();
  }, [user, courseId, onEnrollmentChange]);

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
          <PaymentProcessor
            courseId={courseId}
            courseTitle={courseTitle}
            price={price}
            onPaymentComplete={handlePaymentComplete}
          />
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
