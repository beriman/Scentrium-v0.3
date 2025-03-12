import { useState } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [membershipType, setMembershipType] = useState("free");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signUp(email, password, fullName, membershipType);
      if (error) {
        setError(error.message || "Error creating account");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (
    provider: "google" | "apple" | "facebook",
  ) => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
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
              <UserPlus className="h-5 w-5" /> Join Scentrium
            </CardTitle>
            <CardDescription className="text-center">
              Create an account to connect with fellow fragrance enthusiasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => handleOAuthSignIn("google")}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => handleOAuthSignIn("apple")}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"
                      fill="currentColor"
                    />
                  </svg>
                  Apple
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => handleOAuthSignIn("facebook")}
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Label>Membership Type</Label>
                  <RadioGroup
                    value={membershipType}
                    onValueChange={setMembershipType}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${membershipType === "free" ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}
                    >
                      <RadioGroupItem
                        value="free"
                        id="free"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="free"
                        className="flex items-start cursor-pointer"
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${membershipType === "free" ? "border-purple-500" : "border-gray-300"}`}
                        >
                          {membershipType === "free" && (
                            <Check className="h-3 w-3 text-purple-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">Free</div>
                          <div className="text-sm text-gray-500">
                            Access to community features
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${membershipType === "business" ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}
                    >
                      <RadioGroupItem
                        value="business"
                        id="business"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="business"
                        className="flex items-start cursor-pointer"
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${membershipType === "business" ? "border-purple-500" : "border-gray-300"}`}
                        >
                          {membershipType === "business" && (
                            <Check className="h-3 w-3 text-purple-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">Business</div>
                          <div className="text-sm text-gray-500">
                            Additional tools for entrepreneurs
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-700 hover:text-purple-900 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
