import { Provider } from "@supabase/supabase-js";

/**
 * Centralized OAuth configuration
 */
export const oAuthConfig = {
  /**
   * Get OAuth configuration for a provider
   */
  getProviderConfig: (provider: Provider, customRedirectTo?: string) => {
    const redirectTo =
      customRedirectTo || `${window.location.origin}/auth/callback`;

    return {
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    };
  },
};

/**
 * Error handling utilities for authentication
 */
export const authErrorHandler = {
  /**
   * Format authentication error message
   */
  formatErrorMessage: (error: any): string => {
    if (!error) return "Unknown error";

    // Handle Supabase auth errors
    if (error.message) {
      return error.message;
    }

    // Handle other types of errors
    if (typeof error === "string") {
      return error;
    }

    return "An authentication error occurred";
  },

  /**
   * Log authentication error
   */
  logError: (context: string, error: any) => {
    console.error(`Auth error (${context}):`, error);
  },
};
