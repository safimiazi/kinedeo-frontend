/**
 * Base API client — handles axios requests, auth headers, token refresh, and error handling.
 *
 * Token strategy:
 *  - accessToken  → localStorage (short-lived, read by JS to set Authorization header)
 *  - refreshToken → HttpOnly cookie (set by backend, never accessible to JS — XSS safe)
 *
 * All requests use `withCredentials: true` so the browser automatically sends the
 * refresh token cookie to the backend without any JS intervention.
 */

import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

// ─── Axios Instance ─────────────────────────────────────────────────────────────

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Always send HttpOnly refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Error Class ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ─── Token Helpers ──────────────────────────────────────────────────────────────

const TOKEN_KEY = 'kinedeo_access_token';
const USER_KEY = 'kinedeo_user';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * The refresh token lives in an HttpOnly cookie managed by the backend.
 * This function is intentionally a no-op from the JS side — the browser
 * sends the cookie automatically with every credentialed request.
 *
 * @deprecated Do not call this — refresh token is not readable by JS.
 */
export function getRefreshToken(): null {
  return null;
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as unknown;
  } catch {
    return null;
  }
}

/**
 * Store access token and user in localStorage.
 * refreshToken is intentionally excluded — it is managed as an HttpOnly cookie.
 */
export function storeTokens(data: { accessToken: string; user: unknown }) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ─── Request Options ────────────────────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** Pass false to skip attaching the access token (e.g. for public endpoints) */
  auth?: boolean;
}

// ─── Token Refresh State ────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Silently refresh the access token using the HttpOnly cookie.
 * On success, the backend issues a new rotated cookie + returns a new accessToken.
 */
async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const response = await axiosInstance.post<{ accessToken?: string }>(
      '/auth/refresh',
      {},
      { withCredentials: true },
    );
    if (response.data.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.data.accessToken);
    }
    return true;
  } catch {
    return false;
  }
}

// ─── Core Request Function ──────────────────────────────────────────────────────

/**
 * The main request function. Automatically attaches the auth header and handles
 * 401 responses by attempting a silent token refresh + one retry.
 *
 * `withCredentials: true` is set on the axios instance so the browser always
 * sends the HttpOnly refresh token cookie.
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true } = options;

  const config: AxiosRequestConfig = {
    method,
    url: endpoint,
    headers: { ...headers },
    data: body,
  };

  // Attach access token if auth is enabled
  if (auth) {
    const token = getAccessToken();
    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response: AxiosResponse<T> = await axiosInstance.request<T>(config);

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.data;
  } catch (err: unknown) {
    if (!axios.isAxiosError(err)) throw err;

    const status = err.response?.status ?? 0;

    // Handle 401 — only attempt silent refresh if user has a stored session.
    if (status === 401 && auth && getStoredUser() !== null) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = attemptTokenRefresh().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const refreshed = await (refreshPromise ?? attemptTokenRefresh());

      if (refreshed) {
        // Retry with the new access token
        const newToken = getAccessToken();
        if (newToken) {
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        }
        const retryResponse: AxiosResponse<T> = await axiosInstance.request<T>(config);
        return retryResponse.data;
      } else {
        // Both access token and refresh cookie are gone — clear stale localStorage
        clearTokens();
        throw new ApiError('Session expired. Please login again.', 401);
      }
    }

    // All other errors
    const errorData = err.response?.data as { message?: string } | undefined;
    throw new ApiError(
      errorData?.message || `Request failed with status ${status}`,
      status,
      errorData,
    );
  }
}
