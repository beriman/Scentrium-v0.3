import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const AuthLayout = lazy(() => import("../../components/auth/AuthLayout"));
const LoginForm = lazy(() => import("../../components/auth/LoginForm"));
const SignUpForm = lazy(() => import("../../components/auth/SignUpForm"));
const ForgotPasswordForm = lazy(
  () => import("../../components/auth/ForgotPasswordForm"),
);
const ResetPasswordForm = lazy(
  () => import("../../components/auth/ResetPasswordForm"),
);
const Setup2FAForm = lazy(() => import("../../components/auth/Setup2FAForm"));
const Verify2FAForm = lazy(() => import("../../components/auth/Verify2FAForm"));
const AuthCallback = lazy(() => import("../../components/auth/AuthCallback"));

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginForm /> },
      { path: "/signup", element: <SignUpForm /> },
      { path: "/forgot-password", element: <ForgotPasswordForm /> },
      { path: "/reset-password", element: <ResetPasswordForm /> },
      { path: "/setup-2fa", element: <Setup2FAForm /> },
      { path: "/verify-2fa", element: <Verify2FAForm /> },
    ],
  },
  { path: "/auth/callback", element: <AuthCallback /> },
];
