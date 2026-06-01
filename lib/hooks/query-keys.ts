/**
 * Centralized query key factory — makes cache invalidation predictable and scalable.
 * Each domain has its own key factory with hierarchical keys.
 *
 * Usage:
 *   queryKeys.products.all()        → invalidate all product queries
 *   queryKeys.products.list(params) → specific list query
 *   queryKeys.products.detail(id)   → specific product
 */

export const queryKeys = {
  auth: {
    all: () => ['auth'] as const,
    profile: () => ['auth', 'profile'] as const,
    favorites: () => ['auth', 'favorites'] as const,
  },

  products: {
    all: () => ['products'] as const,
    list: (params?: { page?: number; limit?: number; categoryId?: string; search?: string }) =>
      ['products', 'list', params] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },

  categories: {
    all: () => ['categories'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },

  flashSales: {
    all: () => ['flash-sales'] as const,
    active: () => ['flash-sales', 'active'] as const,
  },
} as const;
