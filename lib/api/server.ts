/**
 * Server-side API fetchers — for use ONLY in Next.js Server Components.
 *
 * These functions call the backend directly with fetch() and Next.js caching
 * options. Do NOT import these in client components ("use client" files).
 *
 * All fetchers are wrapped in try/catch so Docker build-time static generation
 * doesn't fail when the backend is unreachable. Pages render with empty data
 * and revalidate at runtime when the backend is available.
 */

import type { Product, PaginatedProducts, Category, Announcement, FlashSale, Bundle } from './types';

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

// ─── Products ──────────────────────────────────────────────────────────────────

export async function serverGetProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PaginatedProducts> {
  try {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.categoryId) qs.set('categoryId', params.categoryId);
    if (params?.search) qs.set('search', params.search);
    if (params?.sortBy) qs.set('sortBy', params.sortBy);
    if (params?.sortOrder) qs.set('sortOrder', params.sortOrder);
    const query = qs.toString();

    const res = await fetch(`${BACKEND}/products${query ? `?${query}` : ''}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { products: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    return res.json() as Promise<PaginatedProducts>;
  } catch {
    return { products: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }
}

export async function serverGetProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BACKEND}/products/${id}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<Product>;
  } catch {
    return null;
  }
}

// ─── Categories ────────────────────────────────────────────────────────────────

export async function serverGetCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BACKEND}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<Category[]>;
  } catch {
    return [];
  }
}

export async function serverGetCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categories = await serverGetCategories();
    return categories.find((c) => c.slug === slug) ?? null;
  } catch {
    return null;
  }
}

// ─── Announcements ─────────────────────────────────────────────────────────────

export async function serverGetActiveAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(`${BACKEND}/announcements/active`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<Announcement[]>;
  } catch {
    return [];
  }
}

// ─── Bundles ───────────────────────────────────────────────────────────────────

export async function serverGetBundle(id: string): Promise<Bundle | null> {
  try {
    const res = await fetch(`${BACKEND}/bundles/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<Bundle>;
  } catch {
    return null;
  }
}

export async function serverGetAllBundles(): Promise<Bundle[]> {
  try {
    const res = await fetch(`${BACKEND}/bundles`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<Bundle[]>;
  } catch {
    return [];
  }
}

// ─── Flash Sales ───────────────────────────────────────────────────────────────

export async function serverGetActiveFlashSales(): Promise<FlashSale[]> {
  try {
    const res = await fetch(`${BACKEND}/flash-sales/active`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<FlashSale[]>;
  } catch {
    return [];
  }
}
