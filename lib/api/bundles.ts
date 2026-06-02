import { apiRequest } from './client';
import type { Bundle } from './types';

export const bundlesApi = {
  // Public
  getActive: () =>
    apiRequest<Bundle | null>('/bundles/active', { auth: false }),

  getById: (id: string) =>
    apiRequest<Bundle>(`/bundles/${id}`, { auth: false }),

  // Admin
  getAll: () =>
    apiRequest<Bundle[]>('/bundles', {}),

  create: (data: {
    name: string;
    description: string;
    badge?: string;
    emoji?: string;
    bundlePrice: number;
    originalPrice?: number;
    productIds: string[];
    isActive?: boolean;
  }) => apiRequest<Bundle>('/bundles', { method: 'POST', body: data }),

  update: (id: string, data: Partial<{
    name: string;
    description: string;
    badge?: string;
    emoji?: string;
    bundlePrice: number;
    originalPrice?: number;
    productIds: string[];
    isActive: boolean;
  }>) => apiRequest<Bundle>(`/bundles/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest<void>(`/bundles/${id}`, { method: 'DELETE' }),
};
