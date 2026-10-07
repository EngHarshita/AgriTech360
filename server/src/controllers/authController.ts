import { Request, Response } from 'express';
import { authService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { AuthenticatedRequest, RegisterDto, LoginDto } from '../types';

/**
 * Handle user registration
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body as RegisterDto);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token: result.token,
    user: result.user
  });
});

/**
 * Handle user authentication
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body as LoginDto);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: result.token,
    user: result.user
  });
});

/**
 * Retrieve current authenticated user profile
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    throw ApiError.unauthorized('User not authenticated');
  }

  const user = await authService.getUserById(req.user.userId);

  res.status(200).json({
    success: true,
    user
  });
});
