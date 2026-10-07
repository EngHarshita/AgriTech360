import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { UserRole } from '../types';

interface ValidationErrorDetail {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,16}$/;
const VALID_ROLES: UserRole[] = ['farmer', 'expert', 'buyer', 'admin'];

/**
 * Validates registration request body
 */
export const validateRegister = (req: Request, _res: Response, next: NextFunction): void => {
  const errors: ValidationErrorDetail[] = [];
  const {
    name,
    email,
    phone,
    password,
    district,
    state,
    landHolding,
    soilType,
    irrigationType,
    role
  } = req.body;

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  // Email validation
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Phone validation
  if (!phone || typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim())) {
    errors.push({ field: 'phone', message: 'Please provide a valid phone number (min 7 digits)' });
  }

  // Password validation
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  // District validation
  if (!district || typeof district !== 'string' || district.trim().length === 0) {
    errors.push({ field: 'district', message: 'District is required' });
  }

  // State validation
  if (!state || typeof state !== 'string' || state.trim().length === 0) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  // LandHolding validation
  if (landHolding === undefined || landHolding === null || typeof landHolding !== 'number' || isNaN(landHolding) || landHolding < 0) {
    errors.push({ field: 'landHolding', message: 'Land holding must be a valid non-negative number' });
  }

  // SoilType validation
  if (!soilType || typeof soilType !== 'string' || soilType.trim().length === 0) {
    errors.push({ field: 'soilType', message: 'Soil type is required' });
  }

  // IrrigationType validation
  if (!irrigationType || typeof irrigationType !== 'string' || irrigationType.trim().length === 0) {
    errors.push({ field: 'irrigationType', message: 'Irrigation type is required' });
  }

  // Role validation (optional)
  if (role !== undefined && !VALID_ROLES.includes(role)) {
    errors.push({
      field: 'role',
      message: `Invalid role specified. Permitted roles: ${VALID_ROLES.join(', ')}`
    });
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Invalid registration input', errors));
  }

  return next();
};

/**
 * Validates login request body
 */
export const validateLogin = (req: Request, _res: Response, next: NextFunction): void => {
  const errors: ValidationErrorDetail[] = [];
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Invalid login credentials provided', errors));
  }

  return next();
};
