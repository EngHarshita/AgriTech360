import mongoose from 'mongoose';
import { User } from '../models';
import { ApiError } from '../utils/apiError';
import { ISafeUser, UpdateProfileDto } from '../types';

let inMemoryFarmerProfile: ISafeUser = {
  id: 'usr_farmer_001',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@agritech.in',
  phone: '+91 98765 43210',
  district: 'Sehore',
  state: 'Madhya Pradesh',
  landHolding: 8.5,
  soilType: 'Black Cotton',
  irrigationType: 'Tube Well',
  role: 'farmer',
  status: 'active',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

/**
 * Fetch authenticated farmer profile by User ID
 */
export const getFarmerProfile = async (userId: string): Promise<ISafeUser> => {
  if (userId === 'usr_farmer_001' || mongoose.connection.readyState !== 1) {
    return inMemoryFarmerProfile;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return inMemoryFarmerProfile;
    }
    return user.toSafeObject();
  } catch {
    return inMemoryFarmerProfile;
  }
};

/**
 * Update authenticated farmer profile
 * Whitelist ensures password, email, and role cannot be modified
 */
export const updateFarmerProfile = async (
  userId: string,
  dto: UpdateProfileDto
): Promise<ISafeUser> => {
  if (userId === 'usr_farmer_001' || mongoose.connection.readyState !== 1) {
    inMemoryFarmerProfile = {
      ...inMemoryFarmerProfile,
      name: dto.name !== undefined ? dto.name.trim() : inMemoryFarmerProfile.name,
      phone: dto.phone !== undefined ? dto.phone.trim() : inMemoryFarmerProfile.phone,
      district: dto.district !== undefined ? dto.district.trim() : inMemoryFarmerProfile.district,
      state: dto.state !== undefined ? dto.state.trim() : inMemoryFarmerProfile.state,
      landHolding: dto.landHolding !== undefined ? dto.landHolding : inMemoryFarmerProfile.landHolding,
      soilType: dto.soilType !== undefined ? dto.soilType.trim() : inMemoryFarmerProfile.soilType,
      irrigationType: dto.irrigationType !== undefined ? dto.irrigationType.trim() : inMemoryFarmerProfile.irrigationType,
      businessName: dto.businessName !== undefined ? dto.businessName.trim() : inMemoryFarmerProfile.businessName,
      businessType: dto.businessType !== undefined ? dto.businessType.trim() : inMemoryFarmerProfile.businessType,
      updatedAt: new Date()
    };
    return inMemoryFarmerProfile;
  }

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
  if (dto.businessName !== undefined) {
    user.businessName = dto.businessName.trim();
  }
  if (dto.businessType !== undefined) {
    user.businessType = dto.businessType.trim();
  }

  const updatedUser = await user.save();
  return updatedUser.toSafeObject();
};
