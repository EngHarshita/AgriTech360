import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiErrorResponse } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Centralized error-handling middleware
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  void _next;
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'ValidationError') {
    // Mongoose schema validation error
    statusCode = 422;
    message = 'Database Validation Error';
    const validationErrors = (err as unknown as { errors: Record<string, { message: string }> }).errors;
    errors = Object.values(validationErrors).map((e) => e.message);
  } else if (err.name === 'CastError') {
    // Mongoose invalid ObjectId error
    statusCode = 400;
    message = 'Invalid resource identifier format';
  } else if ((err as unknown as { code?: number }).code === 11000) {
    // Mongoose duplicate key error
    statusCode = 409;
    const keyValue = (err as unknown as { keyValue?: Record<string, unknown> }).keyValue;
    const field = keyValue ? Object.keys(keyValue)[0] : 'field';
    message = `Duplicate key error: A record with that ${field} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT verification failed
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    // JWT token expired
    statusCode = 401;
    message = 'Authentication token has expired';
  } else if (err instanceof SyntaxError && 'body' in err) {
    // Malformed JSON payload in request
    statusCode = 400;
    message = 'Malformed JSON body in request payload';
  } else {
    // Unhandled or non-operational errors
    message = err.message || 'An unexpected error occurred';
  }

  // Log non-operational errors or 5xx server issues
  if (statusCode >= 500) {
    logger.error(`[Unhandled Server Error] ${req.method} ${req.originalUrl}:`, err);
  } else {
    logger.warn(`[Client Error ${statusCode}] ${req.method} ${req.originalUrl} - ${message}`);
  }

  const responsePayload: ApiErrorResponse = {
    success: false,
    message,
    statusCode,
    ...(errors.length > 0 && { errors }),
    ...(config.env === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(responsePayload);
};
