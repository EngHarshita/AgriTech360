import { Response } from 'express';
import { farmService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import {
  AuthenticatedRequest,
  FarmParcelDetailResponse,
  CreateFarmParcelDto,
  UpdateFarmParcelDto
} from '../types';

/**
 * Retrieve all farm parcels for authenticated farmer
 * GET /api/v1/farms
 */
export const getParcels = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required to access farm parcels');
    }

    const result = await farmService.getFarmerParcels(req.user.userId);
    res.status(200).json(result);
  }
);

/**
 * Retrieve specific farm parcel details by ID
 * GET /api/v1/farms/:id
 */
export const getParcelById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    const id = req.params.id;
    if (!id) {
      throw ApiError.badRequest('Farm parcel ID is required');
    }

    const parcel = await farmService.getParcelById(id, req.user.userId);
    const response: FarmParcelDetailResponse = {
      success: true,
      parcel,
      data: parcel
    };

    res.status(200).json(response);
  }
);

/**
 * Register a new farm field / parcel
 * POST /api/v1/farms
 */
export const createParcel = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    const dto: CreateFarmParcelDto = req.body;
    const parcel = await farmService.createParcel(req.user.userId, dto);

    const response: FarmParcelDetailResponse = {
      success: true,
      message: 'Farm parcel registered successfully',
      parcel,
      data: parcel
    };

    res.status(201).json(response);
  }
);

/**
 * Update an existing farm parcel
 * PUT /api/v1/farms/:id
 */
export const updateParcel = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    const id = req.params.id;
    if (!id) {
      throw ApiError.badRequest('Farm parcel ID is required');
    }

    const dto: UpdateFarmParcelDto = req.body;
    const parcel = await farmService.updateParcel(id, req.user.userId, dto);

    const response: FarmParcelDetailResponse = {
      success: true,
      message: 'Farm parcel updated successfully',
      parcel,
      data: parcel
    };

    res.status(200).json(response);
  }
);

/**
 * Delete a farm parcel
 * DELETE /api/v1/farms/:id
 */
export const deleteParcel = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    const id = req.params.id;
    if (!id) {
      throw ApiError.badRequest('Farm parcel ID is required');
    }

    const result = await farmService.deleteParcel(id, req.user.userId);
    res.status(200).json(result);
  }
);

