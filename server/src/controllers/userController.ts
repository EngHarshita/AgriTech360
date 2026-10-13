import { Response } from 'express';
import { userService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { AuthenticatedRequest, UpdateProfileDto } from '../types';

/**
 * Get authenticated farmer profile
 * GET /api/v1/user/profile
 */
export const getProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required to access profile');
    }

    const user = await userService.getFarmerProfile(req.user.userId);

    res.status(200).json({
      success: true,
      user
    });
  }
);

/**
 * Update authenticated farmer profile
 * PUT /api/v1/user/profile
 */
export const updateProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required to update profile');
    }

    const user = await userService.updateFarmerProfile(
      req.user.userId,
      req.body as UpdateProfileDto
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  }
);
