import { User } from '../models';
import { ApiError } from '../utils/apiError';
import { ISafeUser, UpdateProfileDto } from '../types';

/**
 * Fetch authenticated farmer profile by User ID
 */
export const getFarmerProfile = async (userId: string): Promise<ISafeUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('Farmer profile not found');
  }
  return user.toSafeObject();
};

/**
 * Update authenticated farmer profile
 * Whitelist ensures password, email, and role cannot be modified
 */
export const updateFarmerProfile = async (
  userId: string,
  dto: UpdateProfileDto
): Promise<ISafeUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('Farmer profile not found');
  }

  // Whitelist-only property assignments
  if (dto.name !== undefined) {
    user.name = dto.name.trim();
  }
  if (dto.phone !== undefined) {
    user.phone = dto.phone.trim();
  }
  if (dto.district !== undefined) {
    user.district = dto.district.trim();
  }
  if (dto.state !== undefined) {
    user.state = dto.state.trim();
  }
  if (dto.landHolding !== undefined) {
    user.landHolding = dto.landHolding;
  }
  if (dto.soilType !== undefined) {
    user.soilType = dto.soilType.trim();
  }
  if (dto.irrigationType !== undefined) {
    user.irrigationType = dto.irrigationType.trim();
  }

  const updatedUser = await user.save();
  return updatedUser.toSafeObject();
};
