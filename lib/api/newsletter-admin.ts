import { apiRequest } from './client';

export interface Subscriber {
  email: string;
  source?: string;
  createdAt: string;
}

export interface SubscribersResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  totalPages: number;
}

export const newsletterAdminApi = {
  getSubscribers: (page = 1, limit = 20) =>
    apiRequest<SubscribersResponse>(
      `/newsletter/subscribers?page=${page}&limit=${limit}`
    ),
};
