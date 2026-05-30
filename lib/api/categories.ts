/**
 * Categories API functions — all category-related HTTP calls.
 */

import { apiRequest } from './client';
import type { Category } from './types';

export const categoriesApi = {
  // ─── Public ────────────────────────────────────────────────────────────────

  getAll: (parentId?: string) => {
    const query = parentId ? `?parentId=${parentId}` : '';
    return apiRequest<Category[]>(`/categories${query}`, { auth: false });
  },

  getById: (id: string) =>
    apiRequest<Category>(`/categories/${id}`, { auth: false }),

  // ─── Admin ─────────────────────────────────────────────────────────────────

  getAllAdmin: () =>
    apiRequest<Category[]>('/categories/admin/all', {}),

  create: (data: { name: string; slug: string; description?: string; image?: string; parentId?: string; sortOrder?: number }) =>
    apiRequest<Category>('/categories', { method: 'POST', body: data }),

  update: (id: string, data: Partial<{ name: string; slug: string; description?: string; image?: string; parentId?: string; sortOrder?: number; isActive: boolean }>) =>
    apiRequest<Category>(`/categories/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest<Category>(`/categories/${id}`, { method: 'DELETE' }),
};
