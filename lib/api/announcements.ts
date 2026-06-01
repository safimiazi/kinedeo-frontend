import { apiRequest } from './client';
import type { Announcement, PaginatedAnnouncements } from './types';

export const announcementsApi = {
  getActive: () => apiRequest<Announcement[]>('/announcements/active', { auth: false }),
  getAll: (page = 1, limit = 20) =>
    apiRequest<PaginatedAnnouncements>(`/announcements?page=${page}&limit=${limit}`, {}),
  create: (payload: Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Announcement>('/announcements', { method: 'POST', body: payload }),
  update: (id: string, payload: Partial<Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>>) =>
    apiRequest<Announcement>(`/announcements/${id}`, { method: 'PUT', body: payload }),
  deactivate: (id: string) => apiRequest(`/announcements/${id}`, { method: 'DELETE' }),
};
