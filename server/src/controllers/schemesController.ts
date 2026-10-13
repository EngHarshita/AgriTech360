import { Response } from 'express';
import { schemesService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { AuthenticatedRequest, SchemeQueryParams } from '../types';

/**
 * Retrieve Government Schemes with category, search, and pagination
 * GET /api/v1/schemes
 */
export const getSchemes = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const queryParams: SchemeQueryParams = {
      category: req.query.category as string | undefined,
      search: (req.query.search || req.query.q) as string | undefined,
      page: req.query.page as string | undefined,
      limit: req.query.limit as string | undefined
    };

    const result = await schemesService.getSchemes(queryParams, req.user?.userId);

    res.status(200).json(result);
  }
);

/**
 * Retrieve single scheme details by ID or ShortCode
 * GET /api/v1/schemes/:id
 */
export const getSchemeById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
      throw ApiError.badRequest('Scheme ID is required');
    }

    const scheme = await schemesService.getSchemeById(id, req.user?.userId);

    res.status(200).json({
      success: true,
      scheme,
      data: scheme // Dual-envelope for client compatibility
    });
  }
);

/**
 * Toggle bookmark status for authenticated farmer
 * POST /api/v1/schemes/:id/bookmark
 */
export const bookmarkScheme = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required to bookmark schemes');
    }

    const id = req.params.id;
    if (!id) {
      throw ApiError.badRequest('Scheme ID is required');
    }

    const result = await schemesService.toggleBookmark(id, req.user.userId);

    res.status(200).json(result);
  }
);

/**
 * Check farmer eligibility against authenticated profile
 * POST /api/v1/schemes/:id/check-eligibility
 */
export const checkEligibility = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      throw ApiError.unauthorized('Authentication required to verify eligibility');
    }

    const id = req.params.id;
    if (!id) {
      throw ApiError.badRequest('Scheme ID is required');
    }

    const result = await schemesService.checkFarmerEligibility(id, req.user.userId);

    res.status(200).json({
      success: true,
      eligible: result.eligible,
      status: result.status,
      reasons: result.reasons,
      schemeTitle: result.schemeTitle,
      shortCode: result.shortCode,
      farmerProfile: result.farmerProfile
    });
  }
);

/**
 * Seed or refresh GovernmentScheme collection with 25+ realistic schemes
 * POST /api/v1/schemes/seed
 */
export const seedSchemes = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const force = req.query.force === 'true' || req.body?.force === true;
    const count = await schemesService.seedSchemesDatabase(force);

    res.status(200).json({
      success: true,
      message: `Successfully seeded GovernmentScheme collection with ${count} schemes`,
      count
    });
  }
);
