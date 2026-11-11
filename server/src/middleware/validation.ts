import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { UserRole } from '../types';

interface ValidationErrorDetail {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,16}$/;
const PUBLIC_REGISTRATION_ROLES: UserRole[] = ['farmer'];

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

  // Role validation
  if (role !== undefined) {
    if (role === 'admin') {
      errors.push({
        field: 'role',
        message: 'Registration for admin role is prohibited'
      });
    } else if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
      errors.push({
        field: 'role',
        message: `Invalid role specified. Permitted roles: ${PUBLIC_REGISTRATION_ROLES.join(', ')}`
      });
    }
  }

  // Farmer-specific field validation
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

/**
 * Validates profile update request body
 * Allows: name, phone, district, state, landHolding, soilType, irrigationType
 * Forbids: password, email, role
 */
export const validateUpdateProfile = (req: Request, _res: Response, next: NextFunction): void => {
  const errors: ValidationErrorDetail[] = [];
  const body = req.body as Record<string, unknown>;

  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return next(
      ApiError.badRequest('Invalid profile update input', [
        { field: 'body', message: 'At least one field must be provided for update' }
      ])
    );
  }

  // Prevent immutable fields
  if ('password' in body) {
    errors.push({ field: 'password', message: 'Password cannot be updated via profile endpoint' });
  }

  if ('email' in body) {
    errors.push({ field: 'email', message: 'Email cannot be updated via profile endpoint' });
  }

  if ('role' in body) {
    errors.push({ field: 'role', message: 'Role cannot be updated via profile endpoint' });
  }

  // Name validation if provided
  if ('name' in body) {
    const name = body['name'];
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    }
  }

  // Phone validation if provided
  if ('phone' in body) {
    const phone = body['phone'];
    if (typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number (min 7 digits)' });
    }
  }

  // District validation if provided
  if ('district' in body) {
    const district = body['district'];
    if (typeof district !== 'string' || district.trim().length === 0) {
      errors.push({ field: 'district', message: 'District cannot be empty' });
    }
  }

  // State validation if provided
  if ('state' in body) {
    const state = body['state'];
    if (typeof state !== 'string' || state.trim().length === 0) {
      errors.push({ field: 'state', message: 'State cannot be empty' });
    }
  }

  // LandHolding validation if provided
  if ('landHolding' in body) {
    const landHolding = body['landHolding'];
    if (typeof landHolding !== 'number' || isNaN(landHolding) || landHolding < 0) {
      errors.push({ field: 'landHolding', message: 'Land holding must be a valid non-negative number' });
    }
  }

  // SoilType validation if provided
  if ('soilType' in body) {
    const soilType = body['soilType'];
    if (typeof soilType !== 'string' || soilType.trim().length === 0) {
      errors.push({ field: 'soilType', message: 'Soil type cannot be empty' });
    }
  }

  // IrrigationType validation if provided
  if ('irrigationType' in body) {
    const irrigationType = body['irrigationType'];
    if (typeof irrigationType !== 'string' || irrigationType.trim().length === 0) {
      errors.push({ field: 'irrigationType', message: 'Irrigation type cannot be empty' });
    }
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Invalid profile update input', errors));
  }

  return next();
};

const VALID_PARCEL_STATUSES = ['Active Cultivation', 'Fallow', 'Harvested', 'Sowing Prep'];

/**
 * Middleware to validate farm parcel creation payload
 */
export const validateCreateParcel = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, areaAcres, status } = req.body;
  const errors: ValidationErrorDetail[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Farm parcel name is required (minimum 2 characters)' });
  }

  if (areaAcres === undefined || areaAcres === null || typeof areaAcres !== 'number' || isNaN(areaAcres) || areaAcres <= 0) {
    errors.push({ field: 'areaAcres', message: 'Valid land area in acres greater than 0 is required' });
  }

  if (status && !VALID_PARCEL_STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `Invalid status. Must be one of: ${VALID_PARCEL_STATUSES.join(', ')}`
    });
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Invalid farm parcel input', errors));
  }

  return next();
};

/**
 * Middleware to validate farm parcel update payload
 */
export const validateUpdateParcel = (req: Request, _res: Response, next: NextFunction): void => {
  const body = req.body;
  const errors: ValidationErrorDetail[] = [];

  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return next(ApiError.badRequest('Update request must provide at least one modified field'));
  }

  if ('name' in body) {
    const name = body.name;
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Farm parcel name must be at least 2 characters' });
    }
  }

  if ('areaAcres' in body) {
    const area = body.areaAcres;
    if (typeof area !== 'number' || isNaN(area) || area <= 0) {
      errors.push({ field: 'areaAcres', message: 'Valid land area in acres greater than 0 is required' });
    }
  }

  if ('status' in body && body.status) {
    if (!VALID_PARCEL_STATUSES.includes(body.status)) {
      errors.push({
        field: 'status',
        message: `Invalid status. Must be one of: ${VALID_PARCEL_STATUSES.join(', ')}`
      });
    }
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Invalid farm parcel update input', errors));
  }

  return next();
};

