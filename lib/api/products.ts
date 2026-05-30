/**
 * Products API functions — all product-related HTTP calls.
 */

import { apiRequest } from './client';
import type { Product, PaginatedProducts, FlashSale } from './types';

export const productsApi = {
  // ─── Products ──────────────────────────────────────────────────────────────

  getAll: (params?: { page?: number; limit?: number; categoryId?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return apiRequest<PaginatedProducts>(`/products${query ? `?${query}` : ''}`, { auth: false });
  },

  getById: (id: string) =>
    apiRequest<Product>(`/products/${id}`, { auth: false }),

  create: (data: {
    name: string;
    description: string;
    shortDescription: string;
    basePrice: number;
    originalPrice?: number;
    categoryId: string;
    images?: string[];
    badge?: string;
  }) =>
    apiRequest<Product>('/products', { method: 'POST', body: data }),

  update: (id: string, data: Partial<{
    name: string;
    description: string;
    shortDescription: string;
    basePrice: number;
    originalPrice?: number;
    categoryId: string;
    images?: string[];
    badge?: string;
  }>) =>
    apiRequest<Product>(`/products/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest<Product>(`/products/${id}`, { method: 'DELETE' }),

  // ─── Variants ──────────────────────────────────────────────────────────────

  addVariant: (productId: string, data: {
    sku: string;
    attributes?: Record<string, string>;
    priceOverride?: number;
    stockQuantity: number;
    lowStockThreshold?: number;
    images?: string[];
  }) =>
    apiRequest<Product>(`/products/${productId}/variants`, { method: 'POST', body: data }),

  updateVariant: (productId: string, variantId: string, data: Partial<{
    sku: string;
    attributes?: Record<string, string>;
    priceOverride?: number;
    stockQuantity: number;
    lowStockThreshold?: number;
    images?: string[];
  }>) =>
    apiRequest<Product>(`/products/${productId}/variants/${variantId}`, { method: 'PUT', body: data }),

  // ─── Inventory ─────────────────────────────────────────────────────────────

  checkStock: (productId: string, sku: string, qty?: number) => {
    const query = qty ? `?qty=${qty}` : '';
    return apiRequest<{ available: boolean; currentStock: number }>(`/products/${productId}/stock/${sku}${query}`, {});
  },

  adjustStock: (productId: string, sku: string, data: { newQuantity: number; reason: string }) =>
    apiRequest<Product>(`/products/${productId}/stock/${sku}`, { method: 'PUT', body: data }),

  // ─── Images ────────────────────────────────────────────────────────────────

  uploadImages: (productId: string, imageUrls: string[]) =>
    apiRequest<Product>(`/products/${productId}/images`, { method: 'POST', body: { imageUrls } }),

  // ─── Flash Sales ───────────────────────────────────────────────────────────

  getActiveFlashSales: () =>
    apiRequest<FlashSale[]>('/flash-sales/active', { auth: false }),

  getAllFlashSales: () =>
    apiRequest<FlashSale[]>('/flash-sales', {}),

  createFlashSale: (data: { name: string; startTime: string; endTime: string; products: { productId: string; salePrice: number }[] }) =>
    apiRequest<FlashSale>('/flash-sales', { method: 'POST', body: data }),

  updateFlashSale: (id: string, data: Partial<{ name: string; startTime: string; endTime: string; isActive: boolean; products: { productId: string; salePrice: number }[] }>) =>
    apiRequest<FlashSale>(`/flash-sales/${id}`, { method: 'PUT', body: data }),
};
