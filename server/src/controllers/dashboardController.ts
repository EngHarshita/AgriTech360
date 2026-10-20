import { Response } from 'express';
import { dashboardService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest, DashboardMetricsResponse } from '../types';

/**
 * Retrieve dashboard metrics for the authenticated farmer
 * GET /api/v1/dashboard/metrics
 */
export const getMetrics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const metrics = await dashboardService.getFarmerMetrics(userId);

    const responsePayload: DashboardMetricsResponse = {
      success: true,
      metrics,
      data: metrics
    };

    res.status(200).json(responsePayload);
  }
);
