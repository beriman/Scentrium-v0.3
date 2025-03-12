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
    const { action, orderId, adminNotes } = await req.json();

    // Validate input
    if (!action || !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from("marketplace_orders")
      .select(
        "*, buyer:buyer_id(*), seller:seller_id(*), product:product_id(*)",
      )
      .eq("id", orderId)
      .single();

    if (orderError) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
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

        // Check if order is in pending status
        if (order.status !== "pending" || order.payment_status !== "unpaid") {
          return new Response(
            JSON.stringify({ error: "Invalid order status for this action" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Update order status
        const { data: updatedOrder, error: updateError } = await supabaseAdmin
          .from("marketplace_orders")
          .update({
            status: "payment_confirmed",
            payment_status: "paid",
            admin_notes: adminNotes || "Payment confirmed by admin",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .select()
          .single();

        if (updateError) {
          return new Response(
            JSON.stringify({ error: "Failed to update order" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        result = { success: true, order: updatedOrder };
        break;

      case "process_seller_payment":
        // Only admin can process seller payment
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized action" }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Check if order is in completed status
        if (order.status !== "completed" || order.payment_status !== "paid") {
          return new Response(
            JSON.stringify({ error: "Invalid order status for this action" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // In a real app, you would integrate with payment processing
        // For this demo, we'll just update the order notes

        const { data: finalizedOrder, error: finalizeError } =
          await supabaseAdmin
            .from("marketplace_orders")
            .update({
              admin_notes: adminNotes || "Payment sent to seller",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)
            .select()
            .single();

        if (finalizeError) {
          return new Response(
            JSON.stringify({ error: "Failed to update order" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Create notification for seller
        const { error: notificationError } = await supabaseAdmin
          .from("marketplace_notifications")
          .insert({
            user_id: order.seller_id,
            order_id: orderId,
            type: "payment_processed",
            message: `Payment for order #${orderId.substring(0, 8)} has been processed to your account.`,
          });

        if (notificationError) {
          console.error("Failed to create notification:", notificationError);
        }

        result = { success: true, order: finalizedOrder };
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
