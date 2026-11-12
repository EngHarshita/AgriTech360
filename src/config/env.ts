/**
 * AgriTech360 Environment & Integration Configuration
 * Centralized configuration module controlling backend endpoints and mock-to-live switches.
 *
 * PRODUCTION DEFAULTS (when env vars are absent):
 *  - useMockData  → false  (live backend)
 *  - isDemoMode   → false  (no demo banner)
 */

export interface AppConfig {
  apiBaseUrl: string;
  /** When true, services route to internal mock datasets instead of the live backend. */
  useMockData: boolean;
  /**
   * When true, a visible DEMO banner is shown in the UI so users know they are
   * viewing simulated data. Should only be true in an explicit demo/evaluation run.
   */
  isDemoMode: boolean;
  apiTimeoutMs: number;
  environment: 'development' | 'production' | 'test';
  authTokenKey: string;
  /** Separate key used to store mock session state — never sent as a real Bearer token. */
  mockTokenKey: string;
  userStorageKey: string;
  savedSchemesKey: string;
}

const parseBooleanEnv = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined || value === '') return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

const parseNumberEnv = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const env: AppConfig = {
  // API base URL for Express backend (e.g., http://localhost:5000/api/v1)
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api/v1',

  // Master switch: when true, services route to internal mock data.
  // Defaults to false so a missing variable does NOT silently serve mock data in production.
  useMockData: parseBooleanEnv(import.meta.env.VITE_USE_MOCK_DATA, false),

  // Demo mode: renders a visible "DEMO DATA" banner when true.
  // Only activate explicitly for presentations; never set in production.
  isDemoMode: parseBooleanEnv(import.meta.env.VITE_DEMO_MODE, false),

  // Axios network request timeout
  apiTimeoutMs: parseNumberEnv(import.meta.env.VITE_API_TIMEOUT_MS, 10000),

  // Environment mode
  environment: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',

  // LocalStorage keys
  authTokenKey: 'agritech_auth_token',
  mockTokenKey: 'agritech_mock_session',   // never sent as an Authorization header
  userStorageKey: 'agritech_user',
  savedSchemesKey: 'agritech_saved_schemes',
};

export default env;
