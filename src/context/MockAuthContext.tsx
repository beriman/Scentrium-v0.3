import React, { createContext, useContext, ReactNode, useState } from "react";

interface AuthContextType {
  user: any | null;
  profile: any | null;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface MockAuthProviderProps {
  children: ReactNode;
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  const [loading, setLoading] = useState(false);

  // Mock auth data
  const mockUser = {
    id: "mock-user-id",
    email: "user@example.com",
  };

  const mockProfile = {
    id: "mock-profile-id",
    full_name: "Mock User",
    avatar_url: null,
    role: "business",
  };

  const mockSignOut = async () => {
    console.log("Mock sign out");
  };

  const value = {
    user: mockUser,
    profile: mockProfile,
    signOut: mockSignOut,
    isAuthenticated: true,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
