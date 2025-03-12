import { useState, useEffect } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Setup2FAForm() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { setup2FA, verify2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const generateQrCode = async () => {
      setIsLoading(true);
      try {
        const { url, error } = await setup2FA();
        if (error) {
          setError(error.message || "Error setting up 2FA");
        } else if (url) {
          setQrCodeUrl(url);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    generateQrCode();
  }, [setup2FA]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const { error } = await verify2FA(token);
      if (error) {
        setError(error.message || "Invalid verification code");
      } else {
        setIsSetupComplete(true);
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-purple-800">
              <ShieldCheck className="h-5 w-5" /> Set Up Two-Factor
              Authentication
            </CardTitle>
            <CardDescription className="text-center">
              {isSetupComplete
                ? "2FA has been successfully set up for your account"
                : "Enhance your account security with two-factor authentication"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : isSetupComplete ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <p className="text-gray-600">
                  Your account is now protected with two-factor authentication.
                  You'll be redirected to your profile.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>
                        1. Download an authenticator app like Google
                        Authenticator or Authy.
                      </p>
                      <p>2. Scan this QR code with your authenticator app.</p>
                      <p>3. Enter the 6-digit code from the app below.</p>
                    </div>

                    <div className="flex justify-center py-4">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code for 2FA setup"
                        className="border p-2 rounded-lg"
                      />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="token">Verification Code</Label>
                        <Input
                          id="token"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          required
                          maxLength={6}
                          pattern="[0-9]{6}"
                          className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 text-center text-2xl tracking-widest"
                        />
                      </div>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-purple-800"
                        disabled={isVerifying || token.length !== 6}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify and Activate"
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-red-500">
                      {error || "Unable to generate QR code. Please try again."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!isSetupComplete && (
              <div className="text-sm text-center text-gray-600">
                <Link
                  to="/profile"
                  className="text-purple-700 hover:text-purple-900 hover:underline"
                >
                  Skip for now
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
