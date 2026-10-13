import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/apiError';
import { AuthenticatedRequest, JWTPayload } from '../types';

/**
 * Middleware to authenticate requests using JWT Bearer token
 */
export const authenticateJWT = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication token is missing or malformed'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(ApiError.unauthorized('Token not provided'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware for Role-Based Access Control (RBAC)
 */
export const authorizeRoles = (...roles: Array<JWTPayload['role']>) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`Access restricted to roles: [${roles.join(', ')}]`)
      );
    }

    return next();
  };
};
