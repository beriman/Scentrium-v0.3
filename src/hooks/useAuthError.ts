import { useState } from "react";
import { authErrorHandler } from "@/services/AuthService";

/**
 * Hook for handling authentication errors
 */
export function useAuthError() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle an authentication operation that might fail
   */
  const handleAuthOperation = async <T>(
    operation: () => Promise<T>,
    context: string,
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err: any) {
      const formattedError = authErrorHandler.formatErrorMessage(err);
      setError(formattedError);
      authErrorHandler.logError(context, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear any existing error
   */
  const clearError = () => setError(null);

  return {
    error,
    isLoading,
    handleAuthOperation,
    clearError,
    setError,
  };
}
