'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/client';

export interface ShippingSettings {
  standardCost: number;
  expressCost: number;
  freeShippingThreshold: number;
  freeShippingEnabled: boolean;
  expressEnabled: boolean;
  standardLabel: string;
  expressLabel: string;
}

/**
 * Calculate shipping cost from live settings.
 * Mirrors the backend ShippingService.calculateShipping logic exactly.
 */
export function calcShipping(
  settings: ShippingSettings,
  subtotal: number,
  method: 'standard' | 'express' = 'standard',
): number {
  if (method === 'express') {
    return settings.expressEnabled ? settings.expressCost : settings.standardCost;
  }
  if (settings.freeShippingEnabled && subtotal >= settings.freeShippingThreshold) {
    return 0;
  }
  return settings.standardCost;
}

/** Fallback defaults matching the schema defaults — used while loading. */
export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  standardCost: 99,
  expressCost: 120,
  freeShippingThreshold: 999,
  freeShippingEnabled: true,
  expressEnabled: true,
  standardLabel: 'Standard Delivery (3-5 days)',
  expressLabel: 'Express Delivery (1-2 days)',
};

/**
 * Fetches shipping settings from the backend with a 5-minute stale time.
 * Falls back to DEFAULT_SHIPPING_SETTINGS while loading so the UI always has data.
 */
export function useShippingSettings() {
  return useQuery<ShippingSettings>({
    queryKey: ['shipping-settings'],
    queryFn: () => apiRequest<ShippingSettings>('/shipping-settings', { auth: false }),
    staleTime: 5 * 60 * 1000, // 5 minutes — settings rarely change
    placeholderData: DEFAULT_SHIPPING_SETTINGS,
  });
}
