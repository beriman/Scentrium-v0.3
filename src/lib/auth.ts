import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";
import { Profile } from "./supabase";

export async function signUp(
  email: string,
  password: string,
  fullName: string,
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      await createProfile(data.user.id, {
        full_name: fullName,
        username: email.split("@")[0],
        role: "free",
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error signing up:", error);
    return { data: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error signing in:", error);
    return { data: null, error };
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error };
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error getting session:", error);
    return { data: null, error };
  }
}

export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data: data.user, error: null };
  } catch (error) {
    console.error("Error getting user:", error);
    return { data: null, error };
  }
}

export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting profile:", error);
    return { data: null, error };
  }
}

export async function createProfile(
  userId: string,
  profileData: Partial<Profile>,
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ id: userId, ...profileData }]);

    if (error) throw error;

    // Add default badge (Newbie)
    await supabase.from("user_badges").insert([
      {
        user_id: userId,
        badge_id: (
          await supabase
            .from("badges")
            .select("id")
            .eq("name", "Newbie")
            .single()
        ).data?.id,
      },
    ]);

    return { data, error: null };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { data: null, error };
  }
}

export async function updateProfile(
  userId: string,
  profileData: Partial<Profile>,
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { data: null, error };
  }
}

export async function uploadAvatar(userId: string, file: File) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", userId);

    if (updateError) throw updateError;

    return { data: data.publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { data: null, error };
  }
}

export async function uploadCoverPhoto(userId: string, file: File) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-cover-${Math.random()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ cover_photo_url: data.publicUrl })
      .eq("id", userId);

    if (updateError) throw updateError;

    return { data: data.publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading cover photo:", error);
    return { data: null, error };
  }
}

export async function getUserBadges(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_badges")
      .select("*, badge:badges(*)")
      .eq("user_id", userId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting user badges:", error);
    return { data: null, error };
  }
}

export async function followUser(followerId: string, followingId: string) {
  try {
    const { data, error } = await supabase
      .from("follows")
      .insert([{ follower_id: followerId, following_id: followingId }]);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error following user:", error);
    return { data: null, error };
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  try {
    const { data, error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return { data: null, error };
  }
}

export async function blockUser(blockerId: string, blockedId: string) {
  try {
    const { data, error } = await supabase
      .from("blocks")
      .insert([{ blocker_id: blockerId, blocked_id: blockedId }]);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error blocking user:", error);
    return { data: null, error };
  }
}

export async function unblockUser(blockerId: string, blockedId: string) {
  try {
    const { data, error } = await supabase
      .from("blocks")
      .delete()
      .eq("blocker_id", blockerId)
      .eq("blocked_id", blockedId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error unblocking user:", error);
    return { data: null, error };
  }
}

export async function isFollowing(followerId: string, followingId: string) {
  try {
    const { data, error } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return { data: !!data, error: null };
  } catch (error) {
    console.error("Error checking if following:", error);
    return { data: false, error };
  }
}

export async function isBlocked(blockerId: string, blockedId: string) {
  try {
    const { data, error } = await supabase
      .from("blocks")
      .select("*")
      .eq("blocker_id", blockerId)
      .eq("blocked_id", blockedId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return { data: !!data, error: null };
  } catch (error) {
    console.error("Error checking if blocked:", error);
    return { data: false, error };
  }
}
