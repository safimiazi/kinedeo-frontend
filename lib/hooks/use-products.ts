'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api';
import { queryKeys } from './query-keys';
import type { Product, PaginatedProducts, FlashSale } from '../api/types';

// ─── Product Queries ────────────────────────────────────────────────────────────

export function useProducts(params?: { page?: number; limit?: number; categoryId?: string; search?: string }) {
  return useQuery<PaginatedProducts>({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getAll(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(id: string, enabled = true) {
  return useQuery<Product>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id && enabled,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Flash Sale Queries ─────────────────────────────────────────────────────────

export function useActiveFlashSales() {
  return useQuery<FlashSale[]>({
    queryKey: queryKeys.flashSales.active(),
    queryFn: () => productsApi.getActiveFlashSales(),
    staleTime: 60 * 1000,
  });
}

export function useAllFlashSales() {
  return useQuery<FlashSale[]>({
    queryKey: queryKeys.flashSales.all(),
    queryFn: () => productsApi.getAllFlashSales(),
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Product Mutations (Admin) ──────────────────────────────────────────────────

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      shortDescription: string;
      basePrice: number;
      originalPrice?: number;
      categoryId: string;
      images?: string[];
      badge?: string;
    }) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.update(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(queryKeys.products.detail(updatedProduct._id), updatedProduct);
      queryClient.invalidateQueries({ queryKey: queryKeys.products.list() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
    },
  });
}

// ─── Variant Mutations ──────────────────────────────────────────────────────────

export function useAddVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: { sku: string; attributes?: Record<string, string>; priceOverride?: number; stockQuantity: number; lowStockThreshold?: number; images?: string[] } }) =>
      productsApi.addVariant(productId, data),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(queryKeys.products.detail(updatedProduct._id), updatedProduct);
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId, data }: { productId: string; variantId: string; data: Partial<{ sku: string; attributes?: Record<string, string>; priceOverride?: number; stockQuantity: number; lowStockThreshold?: number }> }) =>
      productsApi.updateVariant(productId, variantId, data),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(queryKeys.products.detail(updatedProduct._id), updatedProduct);
    },
  });
}

// ─── Flash Sale Mutations ───────────────────────────────────────────────────────

export function useCreateFlashSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; startTime: string; endTime: string; products: { productId: string; salePrice: number }[] }) =>
      productsApi.createFlashSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.flashSales.all() });
    },
  });
}

export function useUpdateFlashSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; startTime: string; endTime: string; isActive: boolean; products: { productId: string; salePrice: number }[] }> }) =>
      productsApi.updateFlashSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.flashSales.all() });
    },
  });
}
