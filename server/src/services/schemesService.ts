import { GovernmentScheme, User } from '../models';
import { initialSchemesData } from '../data/seedSchemesData';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import {
  IGovernmentScheme,
  SchemeQueryParams,
  SchemesResponse,
  EligibilityCheckResult,
  BookmarkResult
} from '../types';

/**
 * Seed MongoDB collection with realistic Indian agriculture schemes
 */
export const seedSchemesDatabase = async (force: boolean = false): Promise<number> => {
  const currentCount = await GovernmentScheme.countDocuments();
  if (currentCount > 0 && !force) {
    logger.debug(`GovernmentScheme collection already populated (${currentCount} records). Skipping seed.`);
    return currentCount;
  }

  if (force) {
    await GovernmentScheme.deleteMany({});
    logger.info('Cleared existing GovernmentScheme collection for re-seeding.');
  }

  await GovernmentScheme.insertMany(initialSchemesData);
  logger.info(`Successfully seeded GovernmentScheme collection with ${initialSchemesData.length} records.`);
  return initialSchemesData.length;
};

/**
 * Retrieve Government Schemes with category filtering, search, and pagination
 */
export const getSchemes = async (
  queryParams: SchemeQueryParams,
  userId?: string
): Promise<SchemesResponse> => {
  // Auto-seed if database is empty
  const count = await GovernmentScheme.countDocuments();
  if (count === 0) {
    await seedSchemesDatabase();
  }

  const search = queryParams.search || queryParams.q;
  const category = queryParams.category;
  const page = Math.max(1, parseInt(String(queryParams.page || '1'), 10));
  const limit = Math.max(1, Math.min(100, parseInt(String(queryParams.limit || '20'), 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  // 1. Category filter
  if (category && category !== 'All' && category.trim().length > 0) {
    filter.category = category.trim();
  }

  // 2. Search filter across title, shortCode, description, and department
  if (search && search.trim().length > 0) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { shortCode: searchRegex },
      { description: searchRegex },
      { department: searchRegex },
      { category: searchRegex }
    ];
  }

  const [docs, total] = await Promise.all([
    GovernmentScheme.find(filter)
      .sort({ isPopular: -1, bookmarkCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    GovernmentScheme.countDocuments(filter)
  ]);

  const schemes: IGovernmentScheme[] = docs.map((doc) => doc.toSafeObject(userId));
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    success: true,
    schemes,
    data: schemes, // Dual-envelope for frontend compatibility
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Retrieve single scheme details by ID or ShortCode
 */
export const getSchemeById = async (
  idOrShortCode: string,
  userId?: string
): Promise<IGovernmentScheme> => {
  let scheme = null;

  // Try finding by MongoDB ObjectId if valid
  if (idOrShortCode.match(/^[0-9a-fA-F]{24}$/)) {
    scheme = await GovernmentScheme.findById(idOrShortCode);
  }

  // Try finding by ShortCode or title if not found by ObjectId
  if (!scheme) {
    scheme = await GovernmentScheme.findOne({
      $or: [
        { shortCode: new RegExp(`^${idOrShortCode}$`, 'i') },
        { title: new RegExp(`^${idOrShortCode}$`, 'i') }
      ]
    });
  }

  if (!scheme) {
    throw ApiError.notFound(`Government scheme [${idOrShortCode}] not found`);
  }

  return scheme.toSafeObject(userId);
};

/**
 * Toggle bookmark status for authenticated user on a scheme
 */
export const toggleBookmark = async (
  schemeId: string,
  userId: string
): Promise<BookmarkResult> => {
  let scheme = null;
  if (schemeId.match(/^[0-9a-fA-F]{24}$/)) {
    scheme = await GovernmentScheme.findById(schemeId);
  } else {
    scheme = await GovernmentScheme.findOne({ shortCode: new RegExp(`^${schemeId}$`, 'i') });
  }

  if (!scheme) {
    throw ApiError.notFound(`Scheme [${schemeId}] not found for bookmarking`);
  }

  if (!scheme.bookmarkedBy) {
    scheme.bookmarkedBy = [];
  }

  const bookmarkedIndex = scheme.bookmarkedBy.findIndex(
    (id) => id.toString() === userId
  );

  let isBookmarked = false;
  if (bookmarkedIndex >= 0) {
    // Remove bookmark
    scheme.bookmarkedBy.splice(bookmarkedIndex, 1);
    scheme.bookmarkCount = Math.max(0, (scheme.bookmarkCount || 1) - 1);
    isBookmarked = false;
  } else {
    // Add bookmark
    scheme.bookmarkedBy.push(userId);
    scheme.bookmarkCount = (scheme.bookmarkCount || 0) + 1;
    isBookmarked = true;
  }

  await scheme.save();

  return {
    success: true,
    bookmarked: isBookmarked,
    bookmarkCount: scheme.bookmarkCount,
    message: isBookmarked
      ? `Successfully saved ${scheme.shortCode || scheme.title} to bookmarks`
      : `Removed ${scheme.shortCode || scheme.title} from bookmarks`
  };
};

/**
 * Check farmer eligibility for a scheme against their authenticated profile
 */
export const checkFarmerEligibility = async (
  schemeId: string,
  userId: string
): Promise<EligibilityCheckResult> => {
  // 1. Fetch Scheme
  let scheme = null;
  if (schemeId.match(/^[0-9a-fA-F]{24}$/)) {
    scheme = await GovernmentScheme.findById(schemeId);
  } else {
    scheme = await GovernmentScheme.findOne({ shortCode: new RegExp(`^${schemeId}$`, 'i') });
  }

  if (!scheme) {
    throw ApiError.notFound(`Scheme [${schemeId}] not found for eligibility check`);
  }

  // 2. Fetch authenticated farmer profile
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('Farmer profile not found for eligibility verification');
  }

  const farmerState = (user.state || 'Maharashtra').trim();
  const farmerLand = typeof user.landHolding === 'number' ? user.landHolding : 0;
  const farmerIrrigation = (user.irrigationType || 'Drip').trim();
  const farmerSoil = (user.soilType || 'Black Soil').trim();

  const rules = scheme.eligibilityRules || {
    targetStates: ['All'],
    minLandHolding: 0,
    maxLandHolding: 9999,
    targetIrrigationTypes: ['All'],
    targetSoilTypes: ['All']
  };

  const reasons: string[] = [];
  let isEligible = true;

  // Criterion A: State check
  const targetStates = rules.targetStates || ['All'];
  const stateMatched =
    targetStates.includes('All') ||
    targetStates.some((s) => s.toLowerCase() === farmerState.toLowerCase());

  if (stateMatched) {
    reasons.push(`State Jurisdiction: Farmer is registered in ${farmerState}, which is eligible for ${scheme.shortCode || scheme.title}.`);
  } else {
    isEligible = false;
    reasons.push(`State Restriction: Scheme is exclusively applicable in [${targetStates.join(', ')}]. Farmer state is ${farmerState}.`);
  }

  // Criterion B: Land Holding check
  const minLand = rules.minLandHolding ?? 0;
  const maxLand = rules.maxLandHolding ?? 9999;
  const landMatched = farmerLand >= minLand && farmerLand <= maxLand;

  if (landMatched) {
    reasons.push(`Landholding Criteria: Farm size of ${farmerLand} Acres satisfies criteria (${minLand} - ${maxLand === 9999 ? 'unlimited' : `${maxLand} Acres`}).`);
  } else {
    isEligible = false;
    if (farmerLand < minLand) {
      reasons.push(`Landholding Criteria: Minimum landholding of ${minLand} Acres required (current farm size: ${farmerLand} Acres).`);
    } else {
      reasons.push(`Landholding Criteria: Maximum landholding threshold exceeded (${maxLand} Acres ceiling for smallholder target scheme).`);
    }
  }

  // Criterion C: Irrigation Type check
  const targetIrrigation = rules.targetIrrigationTypes || ['All'];
  const irrigationMatched =
    targetIrrigation.includes('All') ||
    targetIrrigation.some((i) =>
      i.toLowerCase().includes(farmerIrrigation.toLowerCase()) ||
      farmerIrrigation.toLowerCase().includes(i.toLowerCase())
    );

  if (irrigationMatched) {
    reasons.push(`Irrigation Setup: Current irrigation infrastructure (${farmerIrrigation}) qualifies for scheme assistance.`);
  } else {
    isEligible = false;
    reasons.push(`Irrigation Setup: Scheme requires [${targetIrrigation.join(', ')}] infrastructure. Farmer registered with ${farmerIrrigation}.`);
  }

  // Criterion D: Soil Type check
  const targetSoil = rules.targetSoilTypes || ['All'];
  const soilMatched =
    targetSoil.includes('All') ||
    targetSoil.some((s) =>
      s.toLowerCase().includes(farmerSoil.toLowerCase()) ||
      farmerSoil.toLowerCase().includes(s.toLowerCase())
    );

  if (soilMatched) {
    reasons.push(`Soil Health: Soil condition (${farmerSoil}) supports eligible cropping practices.`);
  } else {
    isEligible = false;
    reasons.push(`Soil Health: Scheme prioritized for [${targetSoil.join(', ')}] soil zones.`);
  }

  return {
    schemeId: scheme._id.toString(),
    schemeTitle: scheme.title,
    shortCode: scheme.shortCode,
    eligible: isEligible,
    status: isEligible ? 'eligible' : 'not eligible',
    reasons,
    farmerProfile: {
      state: farmerState,
      landHolding: farmerLand,
      irrigationType: farmerIrrigation,
      soilType: farmerSoil
    }
  };
};
