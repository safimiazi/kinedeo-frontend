/**
 * Base API client — handles fetch, auth headers, token refresh, and error handling.
 * All API modules use this as the single HTTP layer.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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

const TOKEN_KEY = 'petal_access_token';
const REFRESH_KEY = 'petal_refresh_token';
const USER_KEY = 'petal_user';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeTokens(data: { accessToken: string; refreshToken: string; user: unknown }) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
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

// ─── Core Request Function ──────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token using the stored refresh token.
 * Returns true if successful, false otherwise.
 */
async function attemptTokenRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    storeTokens(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * The main request function. Automatically attaches auth token and handles
 * 401 responses by attempting a token refresh + retry.
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Attach access token if auth is enabled
  if (auth) {
    const token = getAccessToken();
    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response = await fetch(`${API_BASE}${endpoint}`, config);

  // Handle 401 — attempt token refresh and retry once
  if (response.status === 401 && auth) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = attemptTokenRefresh().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const refreshed = await (refreshPromise ?? attemptTokenRefresh());

    if (refreshed) {
      // Retry with new token
      const newToken = getAccessToken();
      if (newToken) {
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      }
      response = await fetch(`${API_BASE}${endpoint}`, config);
    } else {
      // Refresh failed — clear tokens and throw
      clearTokens();
      throw new ApiError('Session expired. Please login again.', 401);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      (errorData as { message?: string }).message || `Request failed with status ${response.status}`,
      response.status,
      errorData,
    );
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
