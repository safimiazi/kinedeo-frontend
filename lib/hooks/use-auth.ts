'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { storeTokens, clearTokens, getRefreshToken, getAccessToken } from '../api/client';
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

// ─── Favorites ──────────────────────────────────────────────────────────────────

export function useFavorites() {
  const { data: profile } = useProfile();
  return useQuery<{ favorites: string[] }>({
    queryKey: queryKeys.auth.favorites(),
    queryFn: () => authApi.getFavorites(),
    // profile থাকলেই fetch — profile reactive তাই login/logout এ auto enable/disable হয়
    enabled: !!profile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, isFavorited }: { productId: string; isFavorited: boolean }) =>
      isFavorited
        ? authApi.removeFavorite(productId)
        : authApi.addFavorite(productId),
    onMutate: async ({ productId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.favorites() });
      const previous = queryClient.getQueryData<{ favorites: string[] }>(queryKeys.auth.favorites());
      queryClient.setQueryData<{ favorites: string[] }>(queryKeys.auth.favorites(), (old) => {
        const current = old?.favorites ?? [];
        return {
          favorites: isFavorited
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.auth.favorites(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.favorites() });
    },
  });
}
