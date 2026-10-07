import { Request, Response } from 'express';
import { getDBStatus } from '../config';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HealthCheckData } from '../types';

/**
 * Health check controller to inspect server and database status
 */
export const getHealth = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const dbStatus = getDBStatus();
  const mem = process.memoryUsage();

  const toMB = (bytes: number): string => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const isHealthy = dbStatus.status === 'connected';

  const healthData: HealthCheckData = {
    status: isHealthy ? 'healthy' : 'degraded',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memoryUsage: {
      rss: toMB(mem.rss),
      heapTotal: toMB(mem.heapTotal),
      heapUsed: toMB(mem.heapUsed),
      external: toMB(mem.external)
    },
    database: {
      status: dbStatus.status,
      host: dbStatus.host,
      name: dbStatus.name
    }
  };

  sendSuccess(res, 'AgriTech360 backend service is operational', healthData, isHealthy ? 200 : 503);
});
