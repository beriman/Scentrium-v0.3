import {
  supabase,
  ForumCategory,
  ForumThread,
  ForumPost,
  Vote,
} from "./supabase";

// Forum Categories
export async function getForumCategories() {
  try {
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .order("position", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting forum categories:", error);
    return { data: null, error };
  }
}

export async function getForumCategory(slug: string) {
  try {
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting forum category:", error);
    return { data: null, error };
  }
}

// Forum Threads
export async function getForumThreads(categoryId?: string) {
  try {
    let query = supabase
      .from("forum_threads")
      .select("*, user:profiles(*), category:forum_categories(*)");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    // Get post counts for each thread
    const threadIds = data.map((thread) => thread.id);
    const { data: postCounts, error: postCountsError } = await supabase
      .from("forum_posts")
      .select("thread_id, count")
      .in("thread_id", threadIds)
      .group("thread_id");

    if (postCountsError) throw postCountsError;

    // Get vote counts for each thread
    const { data: voteCounts, error: voteCountsError } = await supabase
      .from("votes")
      .select("thread_id, vote_type, count")
      .in("thread_id", threadIds)
      .group("thread_id, vote_type");

    if (voteCountsError) throw voteCountsError;

    // Add post counts and vote counts to threads
    const threadsWithCounts = data.map((thread) => {
      const postCount = postCounts?.find((pc) => pc.thread_id === thread.id);
      const upvotes = voteCounts?.filter(
        (vc) => vc.thread_id === thread.id && vc.vote_type === "upvote",
      );
      const downvotes = voteCounts?.filter(
        (vc) => vc.thread_id === thread.id && vc.vote_type === "downvote",
      );

      return {
        ...thread,
        posts_count: postCount?.count || 0,
        votes_count: (upvotes?.[0]?.count || 0) - (downvotes?.[0]?.count || 0),
      };
    });

    return { data: threadsWithCounts, error: null };
  } catch (error) {
    console.error("Error getting forum threads:", error);
    return { data: null, error };
  }
}

export async function getForumThread(threadId: string) {
  try {
    const { data, error } = await supabase
      .from("forum_threads")
      .select("*, user:profiles(*), category:forum_categories(*)")
      .eq("id", threadId)
      .single();

    if (error) throw error;

    // Increment view count
    await supabase
      .from("forum_threads")
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq("id", threadId);

    return { data, error: null };
  } catch (error) {
    console.error("Error getting forum thread:", error);
    return { data: null, error };
  }
}

export async function createForumThread(
  userId: string,
  categoryId: string,
  title: string,
  content: string,
) {
  try {
    const { data, error } = await supabase
      .from("forum_threads")
      .insert([{ user_id: userId, category_id: categoryId, title, content }])
      .select()
      .single();

    if (error) throw error;

    // Add EXP for creating a thread
    await addExp(userId, 1);

    return { data, error: null };
  } catch (error) {
    console.error("Error creating forum thread:", error);
    return { data: null, error };
  }
}

export async function updateForumThread(
  threadId: string,
  title: string,
  content: string,
) {
  try {
    const { data, error } = await supabase
      .from("forum_threads")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", threadId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating forum thread:", error);
    return { data: null, error };
  }
}

export async function deleteForumThread(threadId: string) {
  try {
    const { data, error } = await supabase
      .from("forum_threads")
      .delete()
      .eq("id", threadId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error deleting forum thread:", error);
    return { data: null, error };
  }
}

// Forum Posts (Replies)
export async function getForumPosts(threadId: string) {
  try {
    const { data, error } = await supabase
      .from("forum_posts")
      .select("*, user:profiles(*)")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting forum posts:", error);
    return { data: null, error };
  }
}

export async function createForumPost(
  userId: string,
  threadId: string,
  content: string,
) {
  try {
    const { data, error } = await supabase
      .from("forum_posts")
      .insert([{ user_id: userId, thread_id: threadId, content }])
      .select()
      .single();

    if (error) throw error;

    // Add EXP for creating a post
    await addExp(userId, 1);

    // Create notification for thread owner
    const { data: thread } = await supabase
      .from("forum_threads")
      .select("user_id, title")
      .eq("id", threadId)
      .single();

    if (thread && thread.user_id !== userId) {
      await supabase.from("notifications").insert([
        {
          user_id: thread.user_id,
          type: "reply",
          content: `Someone replied to your thread: ${thread.title}`,
          related_id: threadId,
        },
      ]);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating forum post:", error);
    return { data: null, error };
  }
}

export async function updateForumPost(postId: string, content: string) {
  try {
    const { data, error } = await supabase
      .from("forum_posts")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating forum post:", error);
    return { data: null, error };
  }
}

export async function deleteForumPost(postId: string) {
  try {
    const { data, error } = await supabase
      .from("forum_posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error deleting forum post:", error);
    return { data: null, error };
  }
}

// Votes
export async function voteThread(
  userId: string,
  threadId: string,
  voteType: "upvote" | "downvote",
) {
  try {
    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", userId)
      .eq("thread_id", threadId)
      .maybeSingle();

    if (checkError) throw checkError;

    // If vote exists and is the same type, remove it
    if (existingVote && existingVote.vote_type === voteType) {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (deleteError) throw deleteError;

      return { data: null, error: null };
    }

    // If vote exists but is different type, update it
    if (existingVote) {
      const { data, error } = await supabase
        .from("votes")
        .update({ vote_type: voteType })
        .eq("id", existingVote.id)
        .select()
        .single();

      if (error) throw error;

      // Add EXP for voting
      await addExp(userId, 1);

      // If downvote, remove EXP from thread owner
      if (voteType === "downvote") {
        const { data: thread } = await supabase
          .from("forum_threads")
          .select("user_id")
          .eq("id", threadId)
          .single();

        if (thread) {
          await addExp(thread.user_id, -1);
        }
      }

      return { data, error: null };
    }

    // If no vote exists, create it
    const { data, error } = await supabase
      .from("votes")
      .insert([{ user_id: userId, thread_id: threadId, vote_type: voteType }])
      .select()
      .single();

    if (error) throw error;

    // Add EXP for voting
    await addExp(userId, 1);

    // If upvote, add EXP to thread owner
    // If downvote, remove EXP from thread owner
    const { data: thread } = await supabase
      .from("forum_threads")
      .select("user_id")
      .eq("id", threadId)
      .single();

    if (thread) {
      await addExp(thread.user_id, voteType === "upvote" ? 1 : -1);

      // Create notification for thread owner if upvote
      if (voteType === "upvote" && thread.user_id !== userId) {
        await supabase.from("notifications").insert([
          {
            user_id: thread.user_id,
            type: "upvote",
            content: "Someone upvoted your thread",
            related_id: threadId,
          },
        ]);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error voting on thread:", error);
    return { data: null, error };
  }
}

export async function votePost(
  userId: string,
  postId: string,
  voteType: "upvote" | "downvote",
) {
  try {
    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .maybeSingle();

    if (checkError) throw checkError;

    // If vote exists and is the same type, remove it
    if (existingVote && existingVote.vote_type === voteType) {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (deleteError) throw deleteError;

      return { data: null, error: null };
    }

    // If vote exists but is different type, update it
    if (existingVote) {
      const { data, error } = await supabase
        .from("votes")
        .update({ vote_type: voteType })
        .eq("id", existingVote.id)
        .select()
        .single();

      if (error) throw error;

      // Add EXP for voting
      await addExp(userId, 1);

      // If downvote, remove EXP from post owner
      if (voteType === "downvote") {
        const { data: post } = await supabase
          .from("forum_posts")
          .select("user_id")
          .eq("id", postId)
          .single();

        if (post) {
          await addExp(post.user_id, -1);
        }
      }

      return { data, error: null };
    }

    // If no vote exists, create it
    const { data, error } = await supabase
      .from("votes")
      .insert([{ user_id: userId, post_id: postId, vote_type: voteType }])
      .select()
      .single();

    if (error) throw error;

    // Add EXP for voting
    await addExp(userId, 1);

    // If upvote, add EXP to post owner
    // If downvote, remove EXP from post owner
    const { data: post } = await supabase
      .from("forum_posts")
      .select("user_id, thread_id")
      .eq("id", postId)
      .single();

    if (post) {
      await addExp(post.user_id, voteType === "upvote" ? 1 : -1);

      // Create notification for post owner if upvote
      if (voteType === "upvote" && post.user_id !== userId) {
        await supabase.from("notifications").insert([
          {
            user_id: post.user_id,
            type: "upvote",
            content: "Someone upvoted your reply",
            related_id: post.thread_id,
          },
        ]);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error voting on post:", error);
    return { data: null, error };
  }
}

export async function getUserVote(
  userId: string,
  threadId?: string,
  postId?: string,
) {
  try {
    let query = supabase.from("votes").select("*").eq("user_id", userId);

    if (threadId) {
      query = query.eq("thread_id", threadId);
    }

    if (postId) {
      query = query.eq("post_id", postId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting user vote:", error);
    return { data: null, error };
  }
}

// Reports
export async function reportThread(
  userId: string,
  threadId: string,
  reason: string,
) {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert([{ user_id: userId, thread_id: threadId, reason }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error reporting thread:", error);
    return { data: null, error };
  }
}

export async function reportPost(
  userId: string,
  postId: string,
  reason: string,
) {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert([{ user_id: userId, post_id: postId, reason }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error reporting post:", error);
    return { data: null, error };
  }
}

// EXP System
async function addExp(userId: string, amount: number) {
  try {
    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("exp, level, daily_exp_earned, last_exp_reset")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    if (!profile) return;

    // Check if daily EXP reset is needed
    const lastReset = new Date(profile.last_exp_reset || new Date());
    const now = new Date();
    const resetNeeded =
      lastReset.getDate() !== now.getDate() ||
      lastReset.getMonth() !== now.getMonth() ||
      lastReset.getFullYear() !== now.getFullYear();

    let dailyExpEarned = profile.daily_exp_earned || 0;

    if (resetNeeded) {
      dailyExpEarned = 0;
    }

    // Check daily EXP limit based on role
    const { data: roleData, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (roleError) throw roleError;

    const dailyExpLimit = roleData.role === "business" ? 500 : 100;

    // If adding EXP would exceed daily limit, cap it
    if (amount > 0 && dailyExpEarned >= dailyExpLimit) {
      return; // Don't add more EXP today
    }

    if (amount > 0) {
      const expToAdd = Math.min(amount, dailyExpLimit - dailyExpEarned);
      dailyExpEarned += expToAdd;
      amount = expToAdd;
    }

    // Calculate new EXP and level
    const newExp = Math.max(0, (profile.exp || 0) + amount);
    let newLevel = profile.level || 1;

    // Level thresholds
    const levelThresholds = [0, 100, 500, 1000, 5000];

    // Check if level up or down is needed
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (newExp >= levelThresholds[i]) {
        newLevel = i + 1;
        break;
      }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        exp: newExp,
        level: newLevel,
        daily_exp_earned: dailyExpEarned,
        last_exp_reset: resetNeeded
          ? now.toISOString()
          : profile.last_exp_reset,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Check if level changed
    if (newLevel !== profile.level) {
      // Get badge for new level
      const levelNames = [
        "Newbie",
        "Explorer",
        "Enthusiast",
        "Expert",
        "Master Perfumer",
      ];
      const newLevelName = levelNames[newLevel - 1];

      const { data: badge, error: badgeError } = await supabase
        .from("badges")
        .select("id")
        .eq("name", newLevelName)
        .single();

      if (badgeError) throw badgeError;

      // Check if user already has this badge
      const { data: existingBadge, error: existingBadgeError } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", badge.id)
        .maybeSingle();

      if (existingBadgeError && existingBadgeError.code !== "PGRST116")
        throw existingBadgeError;

      // If user doesn't have this badge, add it
      if (!existingBadge) {
        await supabase.from("user_badges").insert([
          {
            user_id: userId,
            badge_id: badge.id,
          },
        ]);

        // Create notification for level up
        await supabase.from("notifications").insert([
          {
            user_id: userId,
            type: "level_up",
            content: `You've reached Level ${newLevel}: ${newLevelName}!`,
          },
        ]);
      }
    }

    return { data: { exp: newExp, level: newLevel }, error: null };
  } catch (error) {
    console.error("Error adding EXP:", error);
    return { data: null, error };
  }
}
