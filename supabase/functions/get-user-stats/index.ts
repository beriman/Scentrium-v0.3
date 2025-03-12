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

    // Parse request parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || user.id;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: "Error fetching profile" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user exp and level
    const { data: userExp, error: expError } = await supabase
      .from("user_exp")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (expError && expError.code !== "PGRST116") {
      // PGRST116 is "not found"
      return new Response(
        JSON.stringify({ error: "Error fetching user exp" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get user badges
    const { data: userBadges, error: badgesError } = await supabase
      .from("user_badges")
      .select("*, badge:badge_id(name, description, icon)")
      .eq("user_id", userId);

    if (badgesError) {
      return new Response(
        JSON.stringify({ error: "Error fetching user badges" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get thread count
    const { count: threadCount, error: threadCountError } = await supabase
      .from("forum_threads")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId);

    if (threadCountError) {
      return new Response(
        JSON.stringify({ error: "Error fetching thread count" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get reply count
    const { count: replyCount, error: replyCountError } = await supabase
      .from("forum_replies")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId);

    if (replyCountError) {
      return new Response(
        JSON.stringify({ error: "Error fetching reply count" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get total upvotes received
    const { data: upvotesReceived, error: upvotesError } = await supabase.rpc(
      "get_user_upvotes_received",
      { user_id_param: userId },
    );

    // Get daily exp limit and usage
    const dailyExpLimit = profile.membership_type === "business" ? 500 : 100;
    const dailyExpUsed = userExp?.daily_exp_gained || 0;
    const expResetDate =
      userExp?.exp_reset_date || new Date().toISOString().split("T")[0];

    // Compile user stats
    const userStats = {
      profile,
      exp: {
        total: userExp?.total_exp || 0,
        level: userExp?.level || 1,
        dailyLimit: dailyExpLimit,
        dailyUsed: dailyExpUsed,
        resetDate: expResetDate,
      },
      badges: userBadges || [],
      activity: {
        threadCount: threadCount || 0,
        replyCount: replyCount || 0,
        upvotesReceived: upvotesReceived || 0,
      },
    };

    return new Response(JSON.stringify(userStats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
