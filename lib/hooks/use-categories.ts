'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api';
import { queryKeys } from './query-keys';
import type { Category } from '../api/types';

// ─── Queries ────────────────────────────────────────────────────────────────────

/**
 * Fetch all active categories (public).
 */
export function useCategories(parentId?: string) {
  return useQuery<Category[]>({
    queryKey: [...queryKeys.categories.all(), parentId],
    queryFn: () => categoriesApi.getAll(parentId),
    staleTime: 10 * 60 * 1000, // 10 minutes — categories rarely change
  });
}

/**
 * Fetch ALL categories including inactive (admin).
 */
export function useCategoriesAdmin() {
  return useQuery<Category[]>({
    queryKey: ['categories', 'admin'],
    queryFn: () => categoriesApi.getAllAdmin(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single category by ID.
 */
export function useCategory(id: string, enabled = true) {
  return useQuery<Category>({
    queryKey: ['categories', 'detail', id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────────

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; slug: string; description?: string; image?: string; parentId?: string; sortOrder?: number }) =>
      categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; slug: string; description?: string; image?: string; parentId?: string; sortOrder?: number; isActive: boolean }> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
    },
  });
}
