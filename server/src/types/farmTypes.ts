import { Document, Types } from 'mongoose';

/**
 * Status lifecycle of a farm field parcel
 */
export type FarmParcelStatus = 'Active Cultivation' | 'Fallow' | 'Harvested' | 'Sowing Prep';

/**
 * Geographic GPS Coordinates
 */
export interface IGeoCoordinates {
  lat: number;
  lng: number;
}

/**
 * Farm Field / Parcel Entity Interface
 */
export interface IFarmParcel {
  id?: string;
  farmerId: string;
  name: string;
  surveyNumber?: string;
  village?: string;
  district: string;
  state: string;
  areaAcres: number;
  soilType: string;
  irrigationType: string;
  currentCrop?: string;
  croppingSeason?: string;
  status: FarmParcelStatus;
  coordinates?: IGeoCoordinates;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose Document interface for FarmParcel
 */
export interface IFarmParcelDocument extends Document, Omit<IFarmParcel, 'id' | 'farmerId'> {
  farmerId: Types.ObjectId | string;
  toSafeObject(): IFarmParcel;
}


/**
 * Payload DTO for registering a new farm field / parcel
 */
export interface CreateFarmParcelDto {
  name: string;
  surveyNumber?: string;
  village?: string;
  district?: string;
  state?: string;
  areaAcres: number;
  soilType?: string;
  irrigationType?: string;
  currentCrop?: string;
  croppingSeason?: string;
  status?: FarmParcelStatus;
  coordinates?: IGeoCoordinates;
}

/**
 * Payload DTO for updating an existing farm parcel
 */
export interface UpdateFarmParcelDto {
  name?: string;
  surveyNumber?: string;
  village?: string;
  district?: string;
  state?: string;
  areaAcres?: number;
  soilType?: string;
  irrigationType?: string;
  currentCrop?: string;
  croppingSeason?: string;
  status?: FarmParcelStatus;
  coordinates?: IGeoCoordinates;
}

/**
 * Farm Parcels List API Response Envelope
 */
export interface FarmParcelsResponse {
  success: boolean;
  parcels: IFarmParcel[];
  data?: IFarmParcel[];
  totalAreaAcres: number;
  totalParcels: number;
}

/**
 * Single Farm Parcel Detail Response Envelope
 */
export interface FarmParcelDetailResponse {
  success: boolean;
  message?: string;
  parcel: IFarmParcel;
  data?: IFarmParcel;
}
