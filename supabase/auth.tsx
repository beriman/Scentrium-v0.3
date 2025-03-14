import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import { ProfileService } from "@/services/ProfileService";
import { oAuthConfig, authErrorHandler } from "@/services/AuthService";

type AuthContextType = {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    membershipType: string,
  ) => Promise<{ error: any | null }>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (password: string) => Promise<{ error: any | null }>;
  setup2FA: () => Promise<{ url: string | null; error: any | null }>;
  verify2FA: (token: string) => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (
    userId: string,
    fullName: string,
    membershipType: string,
  ) => {
    try {
      const { error } = await ProfileService.createProfile({
        id: userId,
        full_name: fullName,
        membership_type: membershipType,
        has_2fa: false,
      });

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in createProfile:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    membershipType: string,
  ) => {
    try {
      console.log("Starting signup process for:", email);
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log(
        "Anon key available:",
        !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      );

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            membership_type: membershipType,
          },
        },
      });

      if (error) {
        console.error("Supabase auth.signUp error:", error);
        return { error };
      }

      if (!data || !data.user) {
        console.error("No user data returned from signUp");
        return { error: new Error("Failed to create user account") };
      }

      console.log("User created successfully, creating profile");
      try {
        await createProfile(data.user.id, fullName, membershipType);
        console.log("Profile created successfully");
      } catch (profileError) {
        console.error("Error creating profile:", profileError);
        return { error: profileError };
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected error in signUp:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Check if 2FA is required
      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("has_2fa, membership_type")
          .eq("id", data.user.id)
          .single();

        if (
          profileData?.has_2fa &&
          profileData.membership_type === "business"
        ) {
          // Redirect to 2FA verification page
          navigate("/verify-2fa");
        } else {
          // Redirect to profile page
          navigate("/profile");
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const config = oAuthConfig.getProviderConfig(provider);
      const { error } = await supabase.auth.signInWithOAuth(config);

      if (error) throw error;
    } catch (error) {
      authErrorHandler.logError("signInWithProvider", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (!error) {
        navigate("/profile");
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const setup2FA = async () => {
    try {
      // This is a mock implementation as Supabase doesn't have built-in 2FA
      // In a real app, you would use a third-party 2FA service or implement your own
      // For now, we'll just update the profile to indicate 2FA is enabled
      if (user && profile && profile.membership_type === "business") {
        const { error } = await supabase
          .from("profiles")
          .update({ has_2fa: true })
          .eq("id", user.id);

        if (error) {
          return { url: null, error };
        }

        // In a real implementation, you would return a QR code URL
        return {
          url:
            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Scentrium:" +
            user.email,
          error: null,
        };
      }

      return {
        url: null,
        error: new Error("User must be logged in and have a business account"),
      };
    } catch (error) {
      return { url: null, error };
    }
  };

  const verify2FA = async (token: string) => {
    try {
      // This is a mock implementation
      // In a real app, you would verify the token against the user's secret
      // For now, we'll just accept any token and redirect to the profile page
      if (token && token.length === 6) {
        navigate("/profile");
        return { error: null };
      }

      return { error: new Error("Invalid token") };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithProvider,
        signOut,
        resetPassword,
        updatePassword,
        setup2FA,
        verify2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
