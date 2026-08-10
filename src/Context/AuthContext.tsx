import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AuthUser } from '../types/auth';
import { getProfile, logoutUser } from '../services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isProvider: boolean;
  isUser: boolean;
  isApproved: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      // Always clear local state, even if the network call failed
      // (e.g. the session/cookie was already gone server-side) — the
      // user should never be stuck "logged in" client-side.
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
    refreshProfile,
    isAdmin: user?.role === 'ADMIN',
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isProvider: user?.role === 'serviceProvider',
    isUser: user?.role === 'user',
    isApproved: user?.approvalStatus === 'APPROVED',
  }), [user, isLoading, logout, refreshProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
