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
    // Create Supabase client with user's JWT
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
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
    const { threadId, replyId, reason } = await req.json();

    // Validate input
    if ((!threadId && !replyId) || (threadId && replyId)) {
      return new Response(
        JSON.stringify({
          error: "Must provide either threadId OR replyId, not both or neither",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return new Response(JSON.stringify({ error: "Reason is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has already reported this content
    const { data: existingReport, error: reportCheckError } = await supabase
      .from("forum_reports")
      .select("id")
      .eq("reporter_id", user.id)
      .eq(threadId ? "thread_id" : "reply_id", threadId || replyId)
      .maybeSingle();

    if (reportCheckError) {
      return new Response(
        JSON.stringify({ error: "Error checking existing report" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (existingReport) {
      return new Response(
        JSON.stringify({ error: "You have already reported this content" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create the report
    const { data: report, error: reportError } = await supabase
      .from("forum_reports")
      .insert({
        reporter_id: user.id,
        thread_id: threadId || null,
        reply_id: replyId || null,
        reason: reason.trim(),
        status: "pending",
      })
      .select()
      .single();

    if (reportError) {
      return new Response(JSON.stringify({ error: "Error creating report" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
