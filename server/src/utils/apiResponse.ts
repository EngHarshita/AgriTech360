import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Send standard success response
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  meta?: Record<string, unknown>
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(payload);
};

/**
 * Send resource created response (HTTP 201)
 */
export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): Response => {
  return sendSuccess<T>(res, message, data, 201, meta);
};

/**
 * Send paginated list response
 */
export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T[],
  pagination: PaginatedResponse<T>['pagination'],
  statusCode: number = 200
): Response => {
  const payload: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(payload);
};
