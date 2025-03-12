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
    const { threadId, replyId, voteType } = await req.json();

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

    if (voteType !== "upvote" && voteType !== "downvote") {
      return new Response(
        JSON.stringify({
          error: 'voteType must be either "upvote" or "downvote"',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if user has already voted on this content
    const { data: existingVote, error: voteCheckError } = await supabase
      .from("forum_votes")
      .select("id, vote_type")
      .eq("user_id", user.id)
      .eq(threadId ? "thread_id" : "reply_id", threadId || replyId)
      .maybeSingle();

    if (voteCheckError) {
      return new Response(
        JSON.stringify({ error: "Error checking existing vote" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Begin transaction
    const { data: transaction, error: transactionError } =
      await supabaseAdmin.rpc("begin_transaction");

    try {
      // If user already voted
      if (existingVote) {
        // If same vote type, remove the vote
        if (existingVote.vote_type === voteType) {
          // Delete the vote
          const { error: deleteError } = await supabase
            .from("forum_votes")
            .delete()
            .eq("id", existingVote.id);

          if (deleteError) throw deleteError;

          // Update content vote counts
          if (threadId) {
            const { error: updateError } = await supabase
              .from("forum_threads")
              .update({
                [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc(
                  "decrement",
                  { x: 1 },
                ),
              })
              .eq("id", threadId);

            if (updateError) throw updateError;
          } else {
            const { error: updateError } = await supabase
              .from("forum_replies")
              .update({
                [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc(
                  "decrement",
                  { x: 1 },
                ),
              })
              .eq("id", replyId);

            if (updateError) throw updateError;
          }

          return new Response(
            JSON.stringify({ success: true, action: "removed" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        // If different vote type, change the vote
        else {
          // Update the vote
          const { error: updateVoteError } = await supabase
            .from("forum_votes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);

          if (updateVoteError) throw updateVoteError;

          // Update content vote counts
          if (threadId) {
            const { error: updateError } = await supabase
              .from("forum_threads")
              .update({
                [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc(
                  "increment",
                  { x: 1 },
                ),
                [voteType === "upvote" ? "downvotes" : "upvotes"]: supabase.rpc(
                  "decrement",
                  { x: 1 },
                ),
              })
              .eq("id", threadId);

            if (updateError) throw updateError;
          } else {
            const { error: updateError } = await supabase
              .from("forum_replies")
              .update({
                [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc(
                  "increment",
                  { x: 1 },
                ),
                [voteType === "upvote" ? "downvotes" : "upvotes"]: supabase.rpc(
                  "decrement",
                  { x: 1 },
                ),
              })
              .eq("id", replyId);

            if (updateError) throw updateError;
          }

          return new Response(
            JSON.stringify({ success: true, action: "changed" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }
      // If user hasn't voted yet
      else {
        // Insert new vote
        const { error: insertError } = await supabase
          .from("forum_votes")
          .insert({
            user_id: user.id,
            thread_id: threadId || null,
            reply_id: replyId || null,
            vote_type: voteType,
          });

        if (insertError) throw insertError;

        // Update content vote counts
        if (threadId) {
          const { error: updateError } = await supabase
            .from("forum_threads")
            .update({
              [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc(
                "increment",
                { x: 1 },
              ),
            })
            .eq("id", threadId);

          if (updateError) throw updateError;
        } else {
          const { error: updateError } = await supabase
            .from("forum_replies")
            .update({
              [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc(
                "increment",
                { x: 1 },
              ),
            })
            .eq("id", replyId);

          if (updateError) throw updateError;
        }

        return new Response(
          JSON.stringify({ success: true, action: "added" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    } catch (error) {
      // Rollback transaction on error
      await supabaseAdmin.rpc("rollback_transaction");

      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
