import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiError';

/**
 * Global QueryClient instance with production-grade retry policies,
 * cache retention (gcTime), and intelligent error handling.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 3 minutes before background re-fetching
      staleTime: 1000 * 60 * 3,

      // Inactive cache retained in memory for 15 minutes
      gcTime: 1000 * 60 * 15,

      // Avoid intrusive refetches while farmer is interacting with the dashboard
      refetchOnWindowFocus: false,

      // Automatically re-sync once internet connectivity returns
      refetchOnReconnect: true,

      // Intelligent retry policy
      retry: (failureCount, error) => {
        // Stop retrying on client errors (authentication, validation, not found)
        if (error instanceof ApiError) {
          if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 422) {
            return false;
          }
        }

        // Retry at most 2 times for 5xx server errors and network drops
        return failureCount < 2;
      },

      // Exponential backoff delay (1s, 2s, 4s...)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
