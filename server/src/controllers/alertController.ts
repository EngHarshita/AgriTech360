import { Request, Response } from 'express';
import { alertService } from '../services/alertService';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Handle GET /api/v1/alerts
 * Returns dynamic, categorized alerts with clear telemetry provenance.
 */
export const getAlerts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const location = typeof req.query.location === 'string' ? req.query.location : 'Indore';
    const result = await alertService.getAlerts(location);
    res.status(200).json(result);
  }
);
