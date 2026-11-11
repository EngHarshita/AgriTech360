import mongoose from 'mongoose';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { config } from '../config';
import { ApiError } from '../utils/apiError';
import { RegisterDto, LoginDto, AuthResult, ISafeUser, JWTPayload } from '../types';

/**
 * Generate signed JWT token
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn']
  };

  return jwt.sign(payload, config.jwt.secret, options);
};

/**
 * Register a new user
 */
export const register = async (dto: RegisterDto): Promise<AuthResult> => {
  const normalizedEmail = dto.email.toLowerCase().trim();

  // Reject admin registration from public API
  if (dto.role === 'admin') {
    throw ApiError.forbidden('Public registration for administrative accounts is prohibited');
  }

  // 1. Check for duplicate email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists');
  }

  const userRole = 'farmer';

  // 2. Instantiate and persist new user (password is automatically hashed via pre-save hook)
  const newUser = new User({
    name: dto.name.trim(),
    email: normalizedEmail,
    phone: dto.phone.trim(),
    password: dto.password,
    district: dto.district.trim(),
    state: dto.state.trim(),
    landHolding: dto.landHolding ?? 0,
    soilType: dto.soilType?.trim() || '',
    irrigationType: dto.irrigationType?.trim() || '',
    role: userRole
  });

  const savedUser = await newUser.save();

  // 3. Generate JWT token
  const token = generateToken({
    userId: savedUser._id.toString(),
    email: savedUser.email,
    role: savedUser.role
  });

  return {
    token,
    user: savedUser.toSafeObject()
  };
};

/**
 * Authenticate existing user credentials
 */
export const login = async (dto: LoginDto): Promise<AuthResult> => {
  const normalizedEmail = dto.email.toLowerCase().trim();

  // 1. Find user by email including hidden password field
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // 2. Verify password with bcrypt
  const isPasswordValid = await user.comparePassword(dto.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // 3. Reject suspended accounts
  if ((user as any).status === 'suspended') {
    throw ApiError.forbidden('Your account has been suspended by an administrator. Please contact support.');
  }

  // 4. Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    token,
    user: user.toSafeObject()
  };
};

/**
 * Retrieve user profile by ID
 */
export const getUserById = async (userId: string): Promise<ISafeUser> => {
  if (mongoose.connection.readyState !== 1) {
    throw ApiError.serviceUnavailable('Database connection is offline');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User profile not found');
  }
  return user.toSafeObject();
};
