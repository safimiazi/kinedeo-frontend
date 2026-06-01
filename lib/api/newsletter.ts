import { apiRequest } from './client';

export const newsletterApi = {
  subscribe: (email: string, source = 'homepage') =>
    apiRequest<{ message: string; alreadySubscribed: boolean }>('/newsletter/subscribe', {
      method: 'POST',
      body: { email, source },
      auth: false,
    }),

  unsubscribe: (email: string) =>
    apiRequest<{ message: string }>(`/newsletter/unsubscribe/${encodeURIComponent(email)}`, {
      method: 'POST',
      auth: false,
    }),
};
