import { Response } from 'express';
import { dashboardService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { AuthenticatedRequest, DashboardMetricsResponse } from '../types';

/**
 * Retrieve dashboard metrics for the authenticated farmer
 * GET /api/v1/dashboard/metrics
 */
export const getMetrics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required to access dashboard metrics');
    }

    const metrics = await dashboardService.getFarmerMetrics(req.user.userId);

    const responsePayload: DashboardMetricsResponse = {
      success: true,
      metrics,
      data: metrics
    };

    res.status(200).json(responsePayload);
  }
);
