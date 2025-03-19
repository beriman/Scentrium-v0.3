import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginWireframe = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          Login to Scentrium
        </h2>
        <p className="text-gray-600">
          Connect with fellow fragrance enthusiasts
        </p>
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-md hover:bg-gray-50">
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
          <span>Continue with Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Email</div>
          <div className="h-10 w-full border border-gray-300 rounded-md"></div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Password</div>
          <div className="h-10 w-full border border-gray-300 rounded-md"></div>
        </div>

        <button className="w-full bg-purple-700 text-white p-2 rounded-md hover:bg-purple-800">
          Sign in with Email
        </button>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <span className="text-purple-700">Sign up</span>
      </div>
    </div>
  );
};

export const SignUpWireframe = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          Join Scentrium
        </h2>
        <p className="text-gray-600">
          Create an account to connect with fellow fragrance enthusiasts
        </p>
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-md hover:bg-gray-50">
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
          <span>Sign up with Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Full Name</div>
          <div className="h-10 w-full border border-gray-300 rounded-md"></div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Email</div>
          <div className="h-10 w-full border border-gray-300 rounded-md"></div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Password</div>
          <div className="h-10 w-full border border-gray-300 rounded-md"></div>
        </div>

        <button className="w-full bg-purple-700 text-white p-2 rounded-md hover:bg-purple-800">
          Create account with Email
        </button>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <span className="text-purple-700">Sign in</span>
      </div>
    </div>
  );
};

export const TwoFactorAuthWireframe = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-10 h-12 border-2 border-gray-300 rounded-md flex items-center justify-center text-xl font-bold"
            >
              {i === 0 ? "5" : ""}
            </div>
          ))}
        </div>

        <button className="w-full bg-purple-700 text-white p-2 rounded-md hover:bg-purple-800">
          Verify
        </button>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-purple-700">Didn't receive a code?</span>
      </div>
    </div>
  );
};

export default function AuthWireframes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-4 md:p-8 bg-gray-100">
      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Login Screen</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <LoginWireframe />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Sign Up Screen</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <SignUpWireframe />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">2FA Verification</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <TwoFactorAuthWireframe />
        </CardContent>
      </Card>
    </div>
  );
}
