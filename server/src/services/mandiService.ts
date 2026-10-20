import { MandiPrice } from '../models';
import { initialMandiPricesData } from '../data/seedMandiPricesData';
import { logger } from '../utils/logger';
import {
  IMandiPrice,
  MandiPriceQueryParams,
  MandiPricesResponse,
  RevenueEstimationResult
} from '../types';

/**
 * Seed MongoDB collection with realistic Indian APMC market prices if empty
 */
export const seedMandiDatabase = async (force: boolean = false): Promise<number> => {
  const currentCount = await MandiPrice.countDocuments();
  if (currentCount > 0 && !force) {
    logger.debug(`MandiPrice collection already populated (${currentCount} records). Skipping seed.`);
    return currentCount;
  }

  if (force) {
    await MandiPrice.deleteMany({});
    logger.info('Cleared existing MandiPrice collection for re-seeding.');
  }

  await MandiPrice.insertMany(initialMandiPricesData);
  logger.info(`Successfully seeded MandiPrice collection with ${initialMandiPricesData.length} APMC records.`);
  return initialMandiPricesData.length;
};

/**
 * Query Mandi prices with search, category/state filtering, and pagination
 */
export const getMandiPrices = async (
  queryParams: MandiPriceQueryParams
): Promise<MandiPricesResponse> => {
  // Ensure collection has initial records
  const count = await MandiPrice.countDocuments();
  if (count === 0) {
    await seedMandiDatabase();
  }

  const { q, category, state } = queryParams;
  const page = Math.max(1, parseInt(String(queryParams.page || '1'), 10));
  const limit = Math.max(1, Math.min(100, parseInt(String(queryParams.limit || '20'), 10)));
  const skip = (page - 1) * limit;

  // Build MongoDB query filter
  const filter: Record<string, unknown> = {};

  // 1. Text or field search across commodity, market, district, state, and variety
  if (q && q.trim().length > 0) {
    const searchRegex = new RegExp(q.trim(), 'i');
    filter.$or = [
      { commodity: searchRegex },
      { market: searchRegex },
      { district: searchRegex },
      { state: searchRegex },
      { variety: searchRegex },
      { hindiName: searchRegex }
    ];
  }

  // 2. Category filter
  if (category && category !== 'All' && category.trim().length > 0) {
    filter.category = category.trim();
  }

  // 3. State filter
  if (state && state !== 'All' && state.trim().length > 0) {
    filter.state = new RegExp(`^${state.trim()}$`, 'i');
  }

  // Execute query with sorting by modal price and update timestamp
  const [docs, total] = await Promise.all([
    MandiPrice.find(filter)
      .sort({ updatedAt: -1, modalPrice: -1 })
      .skip(skip)
      .limit(limit),
    MandiPrice.countDocuments(filter)
  ]);

  const prices: IMandiPrice[] = docs.map((doc) => doc.toSafeObject());
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    success: true,
    prices,
    data: prices, // Dual-envelope for frontend compatibility
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
 * Calculate estimated crop revenue based on APMC modal rates and Government MSP
 */
export const estimateCropRevenue = async (
  commodityName: string,
  quantityQtl: number,
  customPricePerQtl?: number
): Promise<RevenueEstimationResult> => {
  const normalizedCommodity = commodityName.trim();
  const quantity = Math.max(0.1, Number(quantityQtl) || 50);

  // Look up latest benchmark record for commodity
  let priceRecord = await MandiPrice.findOne({
    commodity: new RegExp(`^${normalizedCommodity}$`, 'i')
  }).sort({ modalPrice: -1 });

  if (!priceRecord) {
    // Attempt partial match
    priceRecord = await MandiPrice.findOne({
      commodity: new RegExp(normalizedCommodity, 'i')
    }).sort({ modalPrice: -1 });
  }

  const modalPrice = customPricePerQtl && customPricePerQtl > 0
    ? customPricePerQtl
    : priceRecord?.modalPrice || 2850;

  const msp = priceRecord?.msp || (modalPrice > 2000 ? Math.round(modalPrice * 0.85) : 0);
  const estimatedGrossRevenue = Math.round(quantity * modalPrice);
  const mspGrossRevenue = Math.round(quantity * msp);
  const netGainOverMsp = estimatedGrossRevenue - mspGrossRevenue;

  return {
    commodity: priceRecord?.commodity || normalizedCommodity,
    quantityQtl: quantity,
    modalPricePerQtl: modalPrice,
    estimatedGrossRevenue,
    mspPerQtl: msp,
    mspGrossRevenue,
    netGainOverMsp,
    market: priceRecord?.market || 'Regional APMC Benchmark',
    district: priceRecord?.district || 'Benchmark District',
    state: priceRecord?.state || 'Maharashtra'
  };
};
