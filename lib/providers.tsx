'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch on window focus in development — less noise
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        // Retry once on failure
        retry: 1,
        // Data is fresh for 1 minute by default
        staleTime: 60 * 1000,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  // Create QueryClient once per component lifecycle (avoids sharing between requests in SSR)
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
