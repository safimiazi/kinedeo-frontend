'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { storeTokens, clearTokens, getRefreshToken } from '../api/client';
import { queryKeys } from './query-keys';
import type { TokenResponse, UserProfile } from '../api/types';

// ─── Queries ────────────────────────────────────────────────────────────────────

/**
 * Fetch the current user's profile. Only runs when authenticated.
 */
export function useProfile(enabled = true) {
  return useQuery<UserProfile>({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => authApi.getProfile(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────────

/** Helper to handle successful auth response */
function useAuthSuccess() {
  const queryClient = useQueryClient();

  return (data: TokenResponse) => {
    storeTokens(data);
    queryClient.setQueryData(queryKeys.auth.profile(), {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
    });
  };
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authApi.sendOtp(phone),
  });
}

export function useVerifyOtp() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authApi.verifyOtp(phone, otp),
    onSuccess,
  });
}

export function useLogin() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess,
  });
}

export function useRegister() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; phone?: string }) =>
      authApi.register(data.name, data.email, data.password, data.phone),
    onSuccess,
  });
}

export function useAdminLogin() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.adminLogin(email, password),
    onSuccess,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      authApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.auth.profile(), updatedProfile);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSettled: () => {
      clearTokens();
      queryClient.clear();
    },
  });
}

export function useLogoutAll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSettled: () => {
      clearTokens();
      queryClient.clear();
    },
  });
}
