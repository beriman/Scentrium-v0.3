import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Create Supabase client with user's JWT
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { action, enrollmentId, adminNotes } = await req.json();

    // Validate input
    if (!action || !enrollmentId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get the enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("learning_enrollments")
      .select("*, user:user_id(*), course:course_id(*)")
      .eq("id", enrollmentId)
      .single();

    if (enrollmentError) {
      return new Response(JSON.stringify({ error: "Enrollment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin (in a real app, you would check admin role)
    // For this demo, we'll assume any user can act as admin
    // In production, you should implement proper admin role checks
    const isAdmin = true; // This should be a real check in production

    let result;

    switch (action) {
      case "confirm_payment":
        // Only admin can confirm payment
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized action" }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check if enrollment is in unpaid status
        if (enrollment.payment_status !== "unpaid") {
          return new Response(
            JSON.stringify({
              error: "Invalid enrollment status for this action",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Update enrollment status
        const { data: updatedEnrollment, error: updateError } =
          await supabaseAdmin
            .from("learning_enrollments")
            .update({
              payment_status: "paid",
              admin_notes: adminNotes || "Payment confirmed by admin",
              updated_at: new Date().toISOString(),
            })
            .eq("id", enrollmentId)
            .select()
            .single();

        if (updateError) {
          return new Response(
            JSON.stringify({ error: "Failed to update enrollment" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Create notification for user
        const { error: notificationError } = await supabaseAdmin
          .from("marketplace_notifications")
          .insert({
            user_id: enrollment.user_id,
            type: "course_access_granted",
            message: `Your payment for course "${enrollment.course.title}" has been confirmed. You now have full access to the course.`,
          });

        if (notificationError) {
          console.error("Failed to create notification:", notificationError);
        }

        result = { success: true, enrollment: updatedEnrollment };
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
