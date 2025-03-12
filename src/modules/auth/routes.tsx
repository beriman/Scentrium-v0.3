import { RouteObject } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Verify2FAForm from "@/components/auth/Verify2FAForm";
import Setup2FAForm from "@/components/auth/Setup2FAForm";
import AuthCallback from "@/components/auth/AuthCallback";

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordForm />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordForm />,
  },
  {
    path: "/verify-2fa",
    element: <Verify2FAForm />,
  },
  {
    path: "/setup-2fa",
    element: <Setup2FAForm />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
];
