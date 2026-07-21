/**
 * Base API client — handles fetch, auth headers, token refresh, and error handling.
 *
 * Token strategy:
 *  - accessToken  → localStorage (short-lived, read by JS to set Authorization header)
 *  - refreshToken → HttpOnly cookie (set by backend, never accessible to JS — XSS safe)
 *
 * All requests use `credentials: 'include'` so the browser automatically sends the
 * refresh token cookie to the backend without any JS intervention.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

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

// ─── Core Request Function ──────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Silently refresh the access token.
 * The refresh token is sent automatically via the HttpOnly cookie.
 * On success, the backend issues a new rotated cookie + returns a new accessToken.
 */
async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send the HttpOnly refresh token cookie
    });

    if (!response.ok) return false;

    const data = await response.json() as { accessToken?: string };
    if (data.accessToken) {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * The main request function. Automatically attaches the auth header and handles
 * 401 responses by attempting a silent token refresh + one retry.
 *
 * `credentials: 'include'` is set on every request so the browser always sends
 * the HttpOnly refresh token cookie to the backend.
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true } = options;

  const config: RequestInit = {
    method,
    credentials: 'include', // Always include cookies (refresh token)
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

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const fullUrl = `${API_BASE}${endpoint}`;
  let response = await fetch(fullUrl, config);

  // Handle 401 — only attempt silent refresh if user has a stored session.
  // Guest users (no localStorage entry) will never have a refresh cookie,
  // so calling /auth/refresh would just produce a noisy 403 in the network tab.
  if (response.status === 401 && auth && getStoredUser() !== null) {
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
      console.log(`[API] Retry ${method} ${fullUrl}`);
      response = await fetch(fullUrl, config);
    } else {
      // Both access token and refresh cookie are gone — clear stale localStorage
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

  return response.json() as Promise<T>;
}
