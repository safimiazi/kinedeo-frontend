"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api/auth";
import { getAccessToken, getRefreshToken, getStoredUser, storeTokens, clearTokens } from "./api/client";
import { queryKeys } from "./hooks/query-keys";
import type { AuthUser, TokenResponse } from "./api/types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  // Phone OTP
  sendOtp: (phone: string) => Promise<{ expiresInSeconds: number; otp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  // Email
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  // Admin
  adminLogin: (email: string, password: string) => Promise<void>;
  // Common
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Initialize from stored tokens on mount
  useEffect(() => {
    const storedUser = getStoredUser() as AuthUser | null;
    if (storedUser) {
      setUser(storedUser);
      // Silently validate token in background
      const token = getAccessToken();
      if (token) {
        authApi.getProfile().then((profile) => {
          const updatedUser: AuthUser = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
          };
          setUser(updatedUser);
          storeTokens({ accessToken: token, refreshToken: getRefreshToken() || '', user: updatedUser });
          queryClient.setQueryData(queryKeys.auth.profile(), profile);
        }).catch(async () => {
          // Try refresh
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const response = await authApi.refresh(refreshToken);
              storeTokens(response);
              setUser(response.user);
            } catch {
              clearTokens();
              setUser(null);
            }
          } else {
            clearTokens();
            setUser(null);
          }
        });
      }
    }
    setIsLoading(false);
  }, [queryClient]);

  const handleAuthResponse = useCallback((response: TokenResponse) => {
    storeTokens(response);
    setUser(response.user);
    queryClient.setQueryData(queryKeys.auth.profile(), {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      phone: response.user.phone,
      role: response.user.role,
    });
  }, [queryClient]);

  const sendOtp = useCallback(async (phone: string) => {
    const response = await authApi.sendOtp(phone);
    return { expiresInSeconds: response.expiresInSeconds, otp: response.otp };
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    const response = await authApi.verifyOtp(phone, otp);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    const response = await authApi.register(name, email, password, phone);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const adminLogin = useCallback(async (email: string, password: string) => {
    const response = await authApi.adminLogin(email, password);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Ignore logout errors — clear local state anyway
      }
    }
    clearTokens();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      const updatedUser: AuthUser = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
      };
      setUser(updatedUser);
      const token = getAccessToken();
      const refreshToken = getRefreshToken();
      if (token && refreshToken) {
        storeTokens({ accessToken: token, refreshToken, user: updatedUser });
      }
      queryClient.setQueryData(queryKeys.auth.profile(), profile);
    } catch {
      // Token might be expired
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        login,
        register,
        adminLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
