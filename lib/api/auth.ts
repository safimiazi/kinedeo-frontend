/**
 * Auth API functions — all auth-related HTTP calls.
 *
 * Note: refresh token is managed as an HttpOnly cookie by the backend.
 * No JS code ever reads or writes the refresh token directly.
 */

import { apiRequest } from './client';
import type { TokenResponse, OtpResponse, UserProfile } from './types';

export const authApi = {
  // ─── Phone OTP ──────────────────────────────────────────────────────────────

  sendOtp: (phone: string) =>
    apiRequest<OtpResponse>('/auth/otp/send', {
      method: 'POST',
      body: { phone },
      auth: false,
    }),

  verifyOtp: (phone: string, otp: string) =>
    apiRequest<TokenResponse>('/auth/otp/verify', {
      method: 'POST',
      body: { phone, otp },
      auth: false,
    }),

  // ─── Phone-only login (no OTP) ──────────────────────────────────────────────

  phoneLogin: (phone: string) =>
    apiRequest<TokenResponse>('/auth/phone-login', {
      method: 'POST',
      body: { phone },
      auth: false,
    }),

  // ─── Email + Password ───────────────────────────────────────────────────────

  register: (name: string, email: string, password: string, phone?: string) =>
    apiRequest<TokenResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password, phone },
      auth: false,
    }),

  login: (email: string, password: string) =>
    apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    }),

  // ─── Admin ─────────────────────────────────────────────────────────────────

  adminLogin: (email: string, password: string) =>
    apiRequest<TokenResponse>('/auth/admin/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    }),

  // ─── Token Management ──────────────────────────────────────────────────────

  /**
   * Refresh the access token.
   * The refresh token cookie is sent automatically — no body payload needed.
   */
  refresh: () =>
    apiRequest<TokenResponse>('/auth/refresh', {
      method: 'POST',
      auth: false,
      // credentials: 'include' is set globally in apiRequest
    }),

  /**
   * Logout — backend revokes the refresh token and clears the cookie.
   */
  logout: () =>
    apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  logoutAll: () =>
    apiRequest<{ message: string }>('/auth/logout-all', {
      method: 'POST',
    }),

  // ─── Profile ───────────────────────────────────────────────────────────────

  getProfile: () =>
    apiRequest<UserProfile>('/auth/me', {}),

  updateProfile: (data: { name?: string; phone?: string }) =>
    apiRequest<UserProfile>('/auth/me', {
      method: 'PUT',
      body: data,
    }),

  // ─── Favorites ──────────────────────────────────────────────────────────────

  getFavorites: () =>
    apiRequest<{ favorites: string[] }>('/auth/me/favorites', {}),

  addFavorite: (productId: string) =>
    apiRequest<{ favorites: string[] }>(`/auth/me/favorites/${productId}`, {
      method: 'POST',
    }),

  removeFavorite: (productId: string) =>
    apiRequest<{ favorites: string[] }>(`/auth/me/favorites/${productId}`, {
      method: 'DELETE',
    }),
};
