import axios, { 
  type AxiosInstance, 
  type AxiosResponse, 
  type InternalAxiosRequestConfig 
} from 'axios';
import { env } from '../config/env';
import { formatApiError } from './apiError';

// Central Axios HTTP Client
const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Inject JWT Bearer token and request telemetry
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(env.authTokenKey);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Telemetry and request correlation
    config.headers['X-Client-Version'] = '1.0.0-capstone';
    config.headers['X-Request-Timestamp'] = new Date().toISOString();

    if (env.environment === 'development') {
      console.debug(`[AgriTech360 HTTP] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(formatApiError(error));
  }
);

// Response Interceptor: Structured unwrapping & standardized error mapping
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (env.environment === 'development') {
      console.debug(`[AgriTech360 HTTP ${response.status}] ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const apiError = formatApiError(error);

    // Auto-handle 401 Session Expiry
    if (apiError.status === 401) {
      console.warn('[AgriTech360 HTTP] Session expired or invalid token. Clearing local auth token.');
      localStorage.removeItem(env.authTokenKey);
      // Dispatch custom event for app-level session expiry listeners
      window.dispatchEvent(new CustomEvent('agritech:unauthorized', { detail: apiError }));
    }

    if (env.environment === 'development') {
      console.error(`[AgriTech360 HTTP ${apiError.status}] ${apiError.code}: ${apiError.message}`);
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
