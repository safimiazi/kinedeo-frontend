/**
 * Auth API functions — all auth-related HTTP calls.
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

  refresh: (refreshToken: string) =>
    apiRequest<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
    }),

  logout: (refreshToken: string) =>
    apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: { refreshToken },
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
};
