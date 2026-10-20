/**
 * Standardized Query Key Factory
 * Ensures consistent cache invalidation and query deduplication across all 7 modules.
 */

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => [...queryKeys.dashboard.all, 'metrics'] as const,
  },
  weather: {
    all: ['weather'] as const,
    byLocation: (location?: string) => [...queryKeys.weather.all, location || 'default'] as const,
  },
  mandi: {
    all: ['mandi'] as const,
    list: (search?: string, category?: string) => 
      [...queryKeys.mandi.all, 'list', { search: search || '', category: category || 'All' }] as const,
  },
  crops: {
    all: ['crops'] as const,
    recommendations: (paramsKey?: string) => 
      [...queryKeys.crops.all, 'recommendations', paramsKey || 'default'] as const,
  },
  schemes: {
    all: ['schemes'] as const,
    list: (category?: string) => 
      [...queryKeys.schemes.all, 'list', { category: category || 'All' }] as const,
  },
  alerts: {
    all: ['alerts'] as const,
    list: () => [...queryKeys.alerts.all, 'list'] as const,
  },
};
