import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../supabase/auth";

type RouteGuardOptions = {
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
};

/**
 * Hook to protect routes based on authentication and roles
 * @param options Configuration options for the route guard
 */
export function useRouteGuard(options: RouteGuardOptions = {}) {
  const {
    requireAuth = false,
    allowedRoles = [],
    redirectTo = "/login",
  } = options;
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth state is determined
    if (loading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // Check role-based access if roles are specified
    if (requireAuth && user && allowedRoles.length > 0) {
      const userRole = profile?.role || "free";
      if (!allowedRoles.includes(userRole)) {
        navigate("/", { replace: true });
        return;
      }
    }
  }, [user, profile, loading, requireAuth, allowedRoles, redirectTo, navigate]);

  return { isLoading: loading, isAuthenticated: !!user };
}
