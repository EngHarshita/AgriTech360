import { FarmParcel, User } from '../models';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import {
  IFarmParcel,
  CreateFarmParcelDto,
  UpdateFarmParcelDto,
  FarmParcelsResponse
} from '../types';

/**
 * Retrieve all farm parcels for an authenticated farmer.
 * If farmer has no parcels yet, auto-initializes a default parcel based on their registered profile.
 */
export const getFarmerParcels = async (userId: string): Promise<FarmParcelsResponse> => {
  let parcels = await FarmParcel.find({ farmerId: userId }).sort({ createdAt: -1 });

  // Auto-initialize default parcel if farmer profile has landHolding but no registered parcels
  if (parcels.length === 0) {
    const user = await User.findById(userId);
    if (user) {
      const landHolding = typeof user.landHolding === 'number' && user.landHolding > 0
        ? user.landHolding
        : 5.0;

      const initialParcel = new FarmParcel({
        farmerId: user._id,
        name: `${user.name.split(' ')[0]}'s Main Field (Survey #1)`,
        surveyNumber: 'Khasra #142/3',
        village: 'Rampur',
        district: user.district || 'Indore',
        state: user.state || 'Madhya Pradesh',
        areaAcres: landHolding,
        soilType: user.soilType || 'Black Soil',
        irrigationType: user.irrigationType || 'Drip Irrigation',
        currentCrop: 'Soybean',
        croppingSeason: 'Kharif 2026',
        status: 'Active Cultivation',
        coordinates: { lat: 22.7196, lng: 75.8577 }
      });

      await initialParcel.save();
      logger.info(`Auto-initialized default farm parcel for farmer [${userId}] with ${landHolding} acres.`);
      parcels = [initialParcel];
    }
  }

  const safeParcels: IFarmParcel[] = parcels.map((p) => p.toSafeObject());
  const totalAreaAcres = Number(
    safeParcels.reduce((acc, curr) => acc + (curr.areaAcres || 0), 0).toFixed(2)
  );

  return {
    success: true,
    parcels: safeParcels,
    data: safeParcels,
    totalAreaAcres,
    totalParcels: safeParcels.length
  };
};

/**
 * Retrieve single farm parcel by ID for an authenticated farmer
 */
export const getParcelById = async (
  parcelId: string,
  userId: string
): Promise<IFarmParcel> => {
  if (!parcelId.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid farm parcel ID format');
  }

  const parcel = await FarmParcel.findOne({ _id: parcelId, farmerId: userId });
  if (!parcel) {
    throw ApiError.notFound('Farm parcel not found or does not belong to authenticated farmer');
  }

  return parcel.toSafeObject();
};

/**
 * Register a new farm field / parcel for an authenticated farmer
 */
export const createParcel = async (
  userId: string,
  dto: CreateFarmParcelDto
): Promise<IFarmParcel> => {
  // Validate required fields
  if (!dto.name || dto.name.trim().length === 0) {
    throw ApiError.badRequest('Farm parcel name is required');
  }
  if (!dto.areaAcres || typeof dto.areaAcres !== 'number' || dto.areaAcres <= 0) {
    throw ApiError.badRequest('Valid area in acres greater than 0 is required');
  }

  // Fetch farmer to populate geographic defaults if omitted
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('Farmer profile not found');
  }

  const newParcel = new FarmParcel({
    farmerId: user._id,
    name: dto.name.trim(),
    surveyNumber: dto.surveyNumber?.trim() || '',
    village: dto.village?.trim() || '',
    district: dto.district?.trim() || user.district || 'Indore',
    state: dto.state?.trim() || user.state || 'Madhya Pradesh',
    areaAcres: Number(dto.areaAcres.toFixed(2)),
    soilType: dto.soilType?.trim() || user.soilType || 'Black Soil',
    irrigationType: dto.irrigationType?.trim() || user.irrigationType || 'Drip Irrigation',
    currentCrop: dto.currentCrop?.trim() || 'Soybean',
    croppingSeason: dto.croppingSeason?.trim() || 'Kharif 2026',
    status: dto.status || 'Active Cultivation',
    coordinates: dto.coordinates
  });

  const saved = await newParcel.save();
  logger.info(`Farmer [${userId}] registered new farm parcel: ${saved.name} (${saved.areaAcres} acres)`);
  return saved.toSafeObject();
};

/**
 * Update an existing farm parcel for an authenticated farmer
 */
export const updateParcel = async (
  parcelId: string,
  userId: string,
  dto: UpdateFarmParcelDto
): Promise<IFarmParcel> => {
  if (!parcelId.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid farm parcel ID format');
  }

  const parcel = await FarmParcel.findOne({ _id: parcelId, farmerId: userId });
  if (!parcel) {
    throw ApiError.notFound('Farm parcel not found or unauthorized');
  }

  if (dto.name !== undefined) parcel.name = dto.name.trim();
  if (dto.surveyNumber !== undefined) parcel.surveyNumber = dto.surveyNumber.trim();
  if (dto.village !== undefined) parcel.village = dto.village.trim();
  if (dto.district !== undefined) parcel.district = dto.district.trim();
  if (dto.state !== undefined) parcel.state = dto.state.trim();
  if (dto.areaAcres !== undefined && dto.areaAcres > 0) {
    parcel.areaAcres = Number(dto.areaAcres.toFixed(2));
  }
  if (dto.soilType !== undefined) parcel.soilType = dto.soilType.trim();
  if (dto.irrigationType !== undefined) parcel.irrigationType = dto.irrigationType.trim();
  if (dto.currentCrop !== undefined) parcel.currentCrop = dto.currentCrop.trim();
  if (dto.croppingSeason !== undefined) parcel.croppingSeason = dto.croppingSeason.trim();
  if (dto.status !== undefined) parcel.status = dto.status;
  if (dto.coordinates !== undefined) parcel.coordinates = dto.coordinates;

  const updated = await parcel.save();
  logger.info(`Farmer [${userId}] updated farm parcel [${parcelId}]: ${updated.name}`);
  return updated.toSafeObject();
};

/**
 * Delete a farm parcel for an authenticated farmer
 */
export const deleteParcel = async (
  parcelId: string,
  userId: string
): Promise<{ success: boolean; message: string }> => {
  if (!parcelId.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid farm parcel ID format');
  }

  const deleted = await FarmParcel.findOneAndDelete({ _id: parcelId, farmerId: userId });
  if (!deleted) {
    throw ApiError.notFound('Farm parcel not found or unauthorized');
  }

  logger.info(`Farmer [${userId}] deleted farm parcel [${parcelId}]: ${deleted.name}`);
  return {
    success: true,
    message: `Farm parcel "${deleted.name}" deleted successfully`
  };
};
