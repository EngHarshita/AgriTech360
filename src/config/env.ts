/**
 * AgriTech360 Environment & Integration Configuration
 * Centralized configuration module controlling backend endpoints and mock-to-live switches.
 */

export interface AppConfig {
  apiBaseUrl: string;
  useMockData: boolean;
  apiTimeoutMs: number;
  environment: 'development' | 'production' | 'test';
  authTokenKey: string;
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
  // When false, services execute live HTTP requests to the backend server.
  useMockData: parseBooleanEnv(import.meta.env.VITE_USE_MOCK_DATA, true),

  // Axios network request timeout
  apiTimeoutMs: parseNumberEnv(import.meta.env.VITE_API_TIMEOUT_MS, 10000),

  // Environment mode
  environment: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',

  // LocalStorage keys
  authTokenKey: 'agritech_auth_token',
  userStorageKey: 'agritech_user',
  savedSchemesKey: 'agritech_saved_schemes',
};

export default env;
