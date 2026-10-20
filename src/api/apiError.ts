import axios, { type AxiosError } from 'axios';

export interface FieldValidationError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: unknown;
  public fieldErrors?: FieldValidationError[];
  public isNetworkError: boolean;
  public isTimeout: boolean;
  public isAuthError: boolean;
  public timestamp: string;

  constructor({
    message,
    status = 500,
    code = 'INTERNAL_ERROR',
    details,
    fieldErrors,
    isNetworkError = false,
    isTimeout = false,
  }: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
    fieldErrors?: FieldValidationError[];
    isNetworkError?: boolean;
    isTimeout?: boolean;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.fieldErrors = fieldErrors;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
    this.isAuthError = status === 401 || status === 403;
    this.timestamp = new Date().toISOString();

    // Maintain prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Standardize any unknown error or Axios response into an ApiError instance.
 */
export function formatApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; error?: string; errors?: FieldValidationError[] }>;
    
    // 1. Network / Connectivity Error
    if (axiosErr.code === 'ERR_NETWORK' || !axiosErr.response) {
      return new ApiError({
        message: 'Unable to reach AgriTech360 servers. Please check your internet connection.',
        status: 0,
        code: 'NETWORK_ERROR',
        isNetworkError: true,
        details: axiosErr.message,
      });
    }

    // 2. Request Timeout
    if (axiosErr.code === 'ECONNABORTED' || axiosErr.message.includes('timeout')) {
      return new ApiError({
        message: 'Server request timed out. The server took too long to respond.',
        status: 408,
        code: 'TIMEOUT',
        isTimeout: true,
      });
    }

    const status = axiosErr.response.status;
    const data = axiosErr.response.data;
    const serverMessage = data?.message || data?.error;

    // 3. Status-Specific Handling
    switch (status) {
      case 400:
        return new ApiError({
          message: serverMessage || 'Invalid request parameters provided.',
          status,
          code: 'BAD_REQUEST',
          fieldErrors: data?.errors,
        });
      case 401:
        return new ApiError({
          message: serverMessage || 'Your farming session has expired. Please sign in again.',
          status,
          code: 'UNAUTHORIZED',
        });
      case 403:
        return new ApiError({
          message: serverMessage || 'You do not have permission to perform this farm action.',
          status,
          code: 'FORBIDDEN',
        });
      case 404:
        return new ApiError({
          message: serverMessage || 'The requested agricultural record could not be found.',
          status,
          code: 'NOT_FOUND',
        });
      case 422:
        return new ApiError({
          message: serverMessage || 'Validation failed for submitted soil or farm data.',
          status,
          code: 'UNPROCESSABLE_ENTITY',
          fieldErrors: data?.errors,
        });
      case 429:
        return new ApiError({
          message: 'Too many requests. Please wait a moment before trying again.',
          status,
          code: 'RATE_LIMITED',
        });
      case 500:
      case 502:
      case 503:
        return new ApiError({
          message: serverMessage || 'AgriTech360 server encountered an error. Please try again shortly.',
          status,
          code: 'SERVER_ERROR',
          details: data,
        });
      default:
        return new ApiError({
          message: serverMessage || `Request failed with status code ${status}.`,
          status,
          code: `HTTP_${status}`,
          details: data,
        });
    }
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      status: 500,
      code: 'GENERIC_ERROR',
      details: error.stack,
    });
  }

  return new ApiError({
    message: 'An unexpected agricultural service error occurred.',
    status: 500,
    code: 'UNKNOWN_ERROR',
    details: error,
  });
}
