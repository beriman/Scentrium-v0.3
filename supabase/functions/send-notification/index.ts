// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationData {
  user_id: string;
  message: string;
  type: string;
  order_id?: string;
  course_id?: string;
  thread_id?: string;
  reference_id?: string;
  send_email?: boolean;
  email?: string;
  email_subject?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the request body
    const {
      user_id,
      message,
      type,
      order_id,
      course_id,
      thread_id,
      reference_id,
      send_email,
      email,
      email_subject,
    } = (await req.json()) as NotificationData;

    // Validate required fields
    if (!user_id || !message || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Insert notification into the database
    const { data, error } = await supabaseClient
      .from("user_notifications")
      .insert({
        user_id,
        message,
        type,
        order_id,
        course_id,
        thread_id,
        reference_id,
        is_read: false,
      })
      .select();

    if (error) throw error;

    // Send email notification if requested
    if (send_email && email) {
      // In a real implementation, this would call an email service
      // For now, we'll just log it
      console.log(
        `Email would be sent to ${email}: ${email_subject || "New notification"} - ${message}`,
      );

      // This would be replaced with actual email sending logic
      // const emailResponse = await fetch('https://api.emailservice.com/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: email,
      //     subject: email_subject || 'New notification',
      //     text: message,
      //   }),
      // });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
