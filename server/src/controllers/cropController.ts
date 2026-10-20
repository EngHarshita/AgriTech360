import { Request, Response } from 'express';
import { cropService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { CropRecommendationInput } from '../types';

/**
 * Handle crop recommendation request
 * POST /api/v1/crops/recommend
 */
export const recommendCrop = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CropRecommendationInput;
    const result = await cropService.getCropRecommendations(input);

    res.status(200).json(result);
  }
);
