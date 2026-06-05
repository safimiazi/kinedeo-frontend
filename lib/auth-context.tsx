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
import {
  getAccessToken,
  getStoredUser,
  storeTokens,
  clearTokens,
} from "./api/client";
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

  // Initialize auth state from localStorage on mount.
  // Flow:
  //   1. If localStorage has a stored user → restore it optimistically so the UI
  //      renders immediately without a loading flash.
  //   2. Silently validate the access token with GET /auth/me in the background.
  //      - If it succeeds → update user state with fresh server data.
  //      - If it returns 401 → apiRequest will automatically attempt a silent
  //        refresh via the HttpOnly cookie, then retry.
  //      - If the refresh also fails (no cookie, or cookie expired) → clear
  //        localStorage and set user to null. This is silent — no console error.
  //   3. If localStorage has no user → skip all network calls; user is a guest.
  useEffect(() => {
    const storedUser = getStoredUser() as AuthUser | null;
    const token = getAccessToken();

    // No stored session at all — guest user, nothing to do.
    if (!storedUser || !token) {
      setIsLoading(false);
      return;
    }

    // Optimistically restore from cache so the UI doesn't flash.
    setUser(storedUser);

    authApi
      .getProfile()
      .then((profile) => {
        const updatedUser: AuthUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
        };
        setUser(updatedUser);
        storeTokens({ accessToken: token, user: updatedUser });
        queryClient.setQueryData(queryKeys.auth.profile(), profile);
      })
      .catch(() => {
        // Both the access token and the HttpOnly refresh cookie are gone/invalid.
        // Clear stale localStorage — user must log in again.
        clearTokens();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuthResponse = useCallback(
    (response: TokenResponse) => {
      // accessToken goes to localStorage; refreshToken is already set as a
      // HttpOnly cookie by the backend — we never touch it here.
      storeTokens({ accessToken: response.accessToken, user: response.user });
      setUser(response.user);
      queryClient.setQueryData(queryKeys.auth.profile(), {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: response.user.role,
      });
    },
    [queryClient],
  );

  const sendOtp = useCallback(async (phone: string) => {
    const response = await authApi.sendOtp(phone);
    return { expiresInSeconds: response.expiresInSeconds, otp: response.otp };
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string) => {
      const response = await authApi.verifyOtp(phone, otp);
      handleAuthResponse(response);
    },
    [handleAuthResponse],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login(email, password);
      handleAuthResponse(response);
    },
    [handleAuthResponse],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      const response = await authApi.register(name, email, password, phone);
      handleAuthResponse(response);
    },
    [handleAuthResponse],
  );

  const adminLogin = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.adminLogin(email, password);
      handleAuthResponse(response);
    },
    [handleAuthResponse],
  );

  const logout = useCallback(async () => {
    try {
      // Backend revokes the refresh token DB record and clears the cookie
      await authApi.logout();
    } catch {
      // Even if the server call fails, clear local state so the user is logged out
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
      if (token) {
        storeTokens({ accessToken: token, user: updatedUser });
      }
      queryClient.setQueryData(queryKeys.auth.profile(), profile);
    } catch {
      // Token might be expired — let it fail silently; the 401 handler will redirect
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
