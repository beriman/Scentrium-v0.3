import { supabase } from "../supabase/supabase";
import { User } from "@supabase/supabase-js";

export interface ProfileData {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string | null;
  membership_type: string;
  has_2fa: boolean;
}

export class ProfileService {
  /**
   * Fetch a user's profile from the database
   */
  static async fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { data: null, error };
    }
  }

  /**
   * Create a new user profile
   */
  static async createProfile(profileData: ProfileData) {
    try {
      const { error } = await supabase.from("profiles").insert([profileData]);

      if (error) {
        console.error("Error creating profile:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Error creating profile:", error);
      return { error };
    }
  }

  /**
   * Create a profile from OAuth user data
   */
  static async createProfileFromOAuth(user: User) {
    const profileData: ProfileData = {
      id: user.id,
      full_name:
        user.user_metadata.full_name || user.user_metadata.name || "User",
      email: user.email,
      avatar_url: user.user_metadata.avatar_url || null,
      membership_type: "free",
      has_2fa: false,
    };

    return this.createProfile(profileData);
  }

  /**
   * Check if a profile exists and create one if it doesn't
   */
  static async ensureProfileExists(user: User) {
    try {
      const { data, error } = await this.fetchProfile(user.id);

      // If profile doesn't exist (PGRST116 is "no rows returned" error)
      if (error && error.code === "PGRST116") {
        return this.createProfileFromOAuth(user);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error ensuring profile exists:", error);
      return { data: null, error };
    }
  }

  /**
   * Update a user's profile
   */
  static async updateProfile(userId: string, updates: Partial<ProfileData>) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error };
    }
  }
}
