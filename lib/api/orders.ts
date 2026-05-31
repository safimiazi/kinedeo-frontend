/**
 * Orders API functions.
 */

import { apiRequest } from './client';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
  sku?: string;
  variantLabel?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  area?: string;
  note?: string;
}

export interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  cancelReason?: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'sslcommerz';
}

export const ordersApi = {
  // Customer
  create: (data: CreateOrderPayload) =>
    apiRequest<Order>('/orders', { method: 'POST', body: data, auth: false }),

  createAuthenticated: (data: CreateOrderPayload) =>
    apiRequest<Order>('/orders', { method: 'POST', body: data }),

  getMyOrders: () =>
    apiRequest<Order[]>('/orders/my', {}),

  getOrder: (id: string) =>
    apiRequest<Order>(`/orders/${id}`, {}),

  // Admin
  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return apiRequest<OrdersListResponse>(`/orders/admin/all${query ? `?${query}` : ''}`, {});
  },

  getStats: () =>
    apiRequest<OrderStats>('/orders/admin/stats', {}),

  getOrderAdmin: (id: string) =>
    apiRequest<Order>(`/orders/admin/${id}`, {}),

  updateStatus: (id: string, data: { status: string; cancelReason?: string }) =>
    apiRequest<Order>(`/orders/admin/${id}/status`, { method: 'PUT', body: data }),
};
