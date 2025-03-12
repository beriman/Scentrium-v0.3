import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const AdminLayout = lazy(() => import("./components/AdminLayout"));
const UserManagementPage = lazy(() => import("./pages/UserManagementPage"));
const ForumModerationPage = lazy(() => import("./pages/ForumModerationPage"));
const ActivityMonitoringPage = lazy(
  () => import("./pages/ActivityMonitoringPage"),
);
const CoursePricingPage = lazy(() => import("./pages/CoursePricingPage"));
const PaymentVerificationPage = lazy(
  () => import("./pages/PaymentVerificationPage"),
);

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <UserManagementPage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "forum", element: <ForumModerationPage /> },
      { path: "activity", element: <ActivityMonitoringPage /> },
      { path: "courses", element: <CoursePricingPage /> },
      { path: "payments", element: <PaymentVerificationPage /> },
    ],
  },
];
