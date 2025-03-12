import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminEnrollmentManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkAdminAndLoadEnrollments = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is admin
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const isUserAdmin = profileData.role === "admin";
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          setIsLoading(false);
          return;
        }

        // Fetch pending enrollments
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from("learning_enrollments")
          .select(
            "*, user:user_id(id, email, full_name), course:course_id(id, title)"
          )
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (enrollmentsError) throw enrollmentsError;
        setEnrollments(enrollmentsData || []);
      } catch (error) {
        console.error("Error loading enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadEnrollments();
  }, [user]);

  const handleViewProof = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setShowProofDialog(true);
  };

  const handleApprove = async (enrollmentId: string) => {
    setIsProcessing(true);
    try {
      // Update enrollment status
      const { error } = await supabase
        .from("learning_enrollments")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", enrollmentId);

      if (error) throw error;

      // Remove from list
      setEnrollments((prev) =>
        prev.filter((enrollment) => enrollment.id !== enrollmentId)
      );

      toast({
        title: "Enrollment Approved",
        description: "The user now has access to the course.",
      });
    } catch (error: any) {
      console.error("Error approving enrollment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to approve enrollment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (enrollmentId: string) => {
    setIsProcessing(true);
    try {
      // Update enrollment status
      const { error } = await supabase
        .from("learning_enrollments")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", enrollmentId);

      if (error) throw error;

      // Remove from list
      setEnrollments((prev) =>
        prev.filter((enrollment) => enrollment.id !== enrollmentId)
      );

      toast({
        title: "Enrollment Rejected",
        description: "The enrollment has been rejected.",
      });
    } catch (error: any) {
      console.error("Error rejecting enrollment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to reject enrollment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  }