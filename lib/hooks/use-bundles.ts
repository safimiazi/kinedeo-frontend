'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bundlesApi } from '../api/bundles';
import { queryKeys } from './query-keys';
import type { Bundle } from '../api/types';

export function useActiveBundle() {
  return useQuery<Bundle | null>({
    queryKey: queryKeys.bundles.active(),
    queryFn: () => bundlesApi.getActive(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useBundle(id: string, enabled = true) {
  return useQuery<Bundle>({
    queryKey: queryKeys.bundles.detail(id),
    queryFn: () => bundlesApi.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllBundles() {
  return useQuery<Bundle[]>({
    queryKey: queryKeys.bundles.all(),
    queryFn: () => bundlesApi.getAll(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bundlesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.active() });
    },
  });
}

export function useUpdateBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof bundlesApi.update>[1] }) =>
      bundlesApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.active() });
      queryClient.setQueryData(queryKeys.bundles.detail(updated._id), updated);
    },
  });
}

export function useDeleteBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bundlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bundles.active() });
    },
  });
}
