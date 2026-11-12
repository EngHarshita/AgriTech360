import { Response } from 'express';
import { adminService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { AuthenticatedRequest, UserStatus } from '../types';

/**
 * GET /api/v1/admin/overview
 * Retrieve aggregated platform metrics and stats
 */
export const getOverview = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    const overview = await adminService.getAdminOverview();
    res.status(200).json({
      success: true,
      data: overview
    });
  }
);

/**
 * GET /api/v1/admin/users
 * Search and retrieve paginated list of users
 */
export const getUsers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { page, limit, search, role, status } = req.query;
    const result = await adminService.getAdminUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: typeof search === 'string' ? search : undefined,
      role: typeof role === 'string' ? (role as any) : undefined,
      status: typeof status === 'string' ? (status as any) : undefined
    });

    res.status(200).json({
      success: true,
      data: result,
      ...result
    });
  }
);

/**
 * PATCH /api/v1/admin/users/:id/status
 * Suspend or restore user account
 */
export const updateUserStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!id) {
      throw ApiError.badRequest('Target user ID is required');
    }

    if (!status || !['active', 'suspended'].includes(status)) {
      throw ApiError.badRequest('Valid status (active or suspended) is required');
    }

    if (!req.user) {
      throw ApiError.unauthorized('Administrative authentication required');
    }

    const updatedUser = await adminService.updateUserStatus(
      id,
      status as UserStatus,
      req.user,
      req.ip || 'unknown',
      reason
    );

    res.status(200).json({
      success: true,
      message: `User account successfully ${status === 'suspended' ? 'suspended' : 'restored'}`,
      user: updatedUser,
      data: updatedUser
    });
  }
);

/**
 * GET /api/v1/admin/logs
 * Retrieve platform audit logs
 */
export const getAuditLogs = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const logs = await adminService.getAuditLogs(limit);

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
      data: logs
    });
  }
);

/**
 * GET /api/v1/admin/health
 * Detailed infrastructure and subsystem telemetry
 */
export const getSystemHealth = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    const health = await adminService.getSystemHealth();
    res.status(200).json({
      success: true,
      data: health
    });
  }
);
