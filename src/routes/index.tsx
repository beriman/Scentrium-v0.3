import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { useAuth } from "../../supabase/auth";

// Import module routes
import { adminRoutes } from "@/modules/admin";
import { authRoutes } from "@/modules/auth";
import { businessRoutes } from "@/modules/business-tools";
import { forumRoutes } from "@/modules/forum";
import { learningRoutes } from "@/modules/learning";
import { marketplaceRoutes } from "@/modules/marketplace";
import { profileRoutes } from "@/modules/profile";

// Layouts
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));

// Pages
const HomePage = lazy(() => import("@/components/pages/home"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Auth guard component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based guard component
export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Wrap routes with protection
const wrapWithProtection = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => {
    // If the route has children, recursively wrap them
    if (route.children) {
      return {
        ...route,
        children: wrapWithProtection(route.children),
      };
    }

    // Wrap the element with ProtectedRoute
    return {
      ...route,
      element: <ProtectedRoute>{route.element}</ProtectedRoute>,
    };
  });
};

// Wrap routes with role-based protection
const wrapWithRoleProtection = (
  routes: RouteObject[],
  allowedRoles: string[],
): RouteObject[] => {
  return routes.map((route) => {
    // If the route has children, recursively wrap them
    if (route.children) {
      return {
        ...route,
        children: wrapWithRoleProtection(route.children, allowedRoles),
      };
    }

    // Wrap the element with RoleProtectedRoute
    return {
      ...route,
      element: (
        <RoleProtectedRoute allowedRoles={allowedRoles}>
          {route.element}
        </RoleProtectedRoute>
      ),
    };
  });
};

// Public routes (no auth required)
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
];

// Auth routes (login, signup, etc.)
const wrappedAuthRoutes: RouteObject[] = authRoutes.map((route) => ({
  ...route,
  element: (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>{route.element}</Suspense>
    </AuthLayout>
  ),
}));

// Protected routes with their respective layouts
const protectedProfileRoutes = wrapWithProtection(profileRoutes);
const protectedForumRoutes = wrapWithProtection(forumRoutes);
const protectedMarketplaceRoutes = wrapWithProtection(marketplaceRoutes);
const protectedLearningRoutes = wrapWithProtection(learningRoutes);

// Role-protected routes
const businessProtectedRoutes = wrapWithRoleProtection(businessRoutes, [
  "business",
  "admin",
]);
const adminProtectedRoutes = wrapWithRoleProtection(adminRoutes, ["admin"]);

// 404 route
const notFoundRoute: RouteObject = {
  path: "*",
  element: <NotFoundPage />,
};

// Combine all routes
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...wrappedAuthRoutes,
  ...protectedProfileRoutes,
  ...protectedForumRoutes,
  ...protectedMarketplaceRoutes,
  ...protectedLearningRoutes,
  ...businessProtectedRoutes,
  ...adminProtectedRoutes,
  notFoundRoute,
];
