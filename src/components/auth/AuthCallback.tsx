import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import AuthLayout from "./AuthLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProfileService } from "@/services/ProfileService";
import { useAuthError } from "@/hooks/useAuthError";

export default function AuthCallback() {
  const { error, isLoading, handleAuthOperation, setError } = useAuthError();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      await handleAuthOperation(async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          // Check if user profile exists, if not create one
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            // Ensure profile exists using the ProfileService
            await ProfileService.ensureProfileExists(userData.user);
          }

          // Redirect to profile page after successful OAuth sign-in
          navigate("/profile");
        }
      }, "auth-callback");
    };

    handleAuthCallback();
  }, [navigate, handleAuthOperation, setError]);

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
