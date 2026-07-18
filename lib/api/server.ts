/**
 * Server-side API fetchers — for use ONLY in Next.js Server Components.
 *
 * These functions call the backend directly with fetch() and Next.js caching
 * options. Do NOT import these in client components ("use client" files).
 *
 * Caching strategy:
 *  - products list  → revalidate every 60s  (prices/stock can change)
 *  - product detail → revalidate every 30s  (flash sale, stock)
 *  - categories     → revalidate every 1h   (rarely changes)
 *  - announcements  → revalidate every 30s  (admin can push urgent messages)
 */

import type { Product, PaginatedProducts, Category, Announcement, FlashSale, Bundle } from './types';

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ─── Products ──────────────────────────────────────────────────────────────────

export async function serverGetProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PaginatedProducts> {
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

  if (!res.ok) {
    return { products: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }
  return res.json() as Promise<PaginatedProducts>;
}

export async function serverGetProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${BACKEND}/products/${id}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  return res.json() as Promise<Product>;
}

// ─── Categories ────────────────────────────────────────────────────────────────

export async function serverGetCategories(): Promise<Category[]> {
  const res = await fetch(`${BACKEND}/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json() as Promise<Category[]>;
}

export async function serverGetCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await serverGetCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

// ─── Announcements ─────────────────────────────────────────────────────────────

export async function serverGetActiveAnnouncements(): Promise<Announcement[]> {
  const res = await fetch(`${BACKEND}/announcements/active`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  return res.json() as Promise<Announcement[]>;
}

// ─── Bundles ───────────────────────────────────────────────────────────────────

export async function serverGetBundle(id: string): Promise<Bundle | null> {
  const res = await fetch(`${BACKEND}/bundles/${id}`, {
    next: { revalidate: 300 }, // revalidate every 5 minutes
  });
  if (!res.ok) return null;
  return res.json() as Promise<Bundle>;
}

export async function serverGetAllBundles(): Promise<Bundle[]> {
  const res = await fetch(`${BACKEND}/bundles`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json() as Promise<Bundle[]>;
}

// ─── Flash Sales ───────────────────────────────────────────────────────────────

export async function serverGetActiveFlashSales(): Promise<FlashSale[]> {
  const res = await fetch(`${BACKEND}/flash-sales/active`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  return res.json() as Promise<FlashSale[]>;
}
