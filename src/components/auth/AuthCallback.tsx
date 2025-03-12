import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import AuthLayout from "./AuthLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          return;
        }

        if (data?.session) {
          // Check if user profile exists, if not create one
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userData.user.id)
              .single();

            if (profileError && profileError.code === "PGRST116") {
              // Profile doesn't exist, create one
              const { error: insertError } = await supabase
                .from("profiles")
                .insert([
                  {
                    id: userData.user.id,
                    full_name:
                      userData.user.user_metadata.full_name ||
                      userData.user.user_metadata.name ||
                      "User",
                    email: userData.user.email,
                    avatar_url: userData.user.user_metadata.avatar_url || null,
                    membership_type: "free",
                    has_2fa: false,
                  },
                ]);

              if (insertError) {
                console.error("Error creating profile:", insertError);
              }
            }
          }

          // Redirect to profile page after successful OAuth sign-in
          navigate("/profile");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred during authentication");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <AuthLayout>
      <Card className="w-full border-none shadow-lg">
        <CardContent className="p-6 text-center">
          {error ? (
            <div>
              <p className="text-red-500 mb-4">Authentication error</p>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Completing authentication...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
