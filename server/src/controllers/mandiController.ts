import { Request, Response } from 'express';
import { mandiService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { MandiPriceQueryParams } from '../types';

/**
 * Retrieve Mandi wholesale prices with search, filtering, and pagination
 * GET /api/v1/mandi
 */
export const getPrices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const queryParams: MandiPriceQueryParams = {
    q: req.query.q as string | undefined,
    category: req.query.category as string | undefined,
    state: req.query.state as string | undefined,
    page: req.query.page as string | undefined,
    limit: req.query.limit as string | undefined
  };

  const result = await mandiService.getMandiPrices(queryParams);

  res.status(200).json(result);
});

/**
 * Calculate estimated crop revenue using APMC modal rate vs MSP
 * GET /api/v1/mandi/estimate
 */
export const estimateRevenue = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const commodity = (req.query.commodity as string) || 'Wheat';
  const quantity = parseFloat(String(req.query.quantity || '50'));
  const price = req.query.price ? parseFloat(String(req.query.price)) : undefined;

  const estimation = await mandiService.estimateCropRevenue(commodity, quantity, price);

  res.status(200).json({
    success: true,
    estimation
  });
});

/**
 * Seed or refresh Mandi collection with 50+ realistic APMC market prices
 * POST /api/v1/mandi/seed
 */
export const seedPrices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const force = req.query.force === 'true' || req.body?.force === true;
  const count = await mandiService.seedMandiDatabase(force);

  res.status(200).json({
    success: true,
    message: `Successfully seeded MandiPrice collection with ${count} APMC records`,
    count
  });
});
