import { Schema, model, Model } from 'mongoose';
import { IFarmParcelDocument, IFarmParcel, FarmParcelStatus } from '../types';

const farmParcelSchema = new Schema<IFarmParcelDocument>(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID reference is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Farm parcel name is required'],
      trim: true,
      maxlength: [100, 'Parcel name cannot exceed 100 characters']
    },
    surveyNumber: {
      type: String,
      trim: true,
      default: ''
    },
    village: {
      type: String,
      trim: true,
      default: ''
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    areaAcres: {
      type: Number,
      required: [true, 'Area in acres is required'],
      min: [0.01, 'Area must be at least 0.01 acres']
    },
    soilType: {
      type: String,
      trim: true,
      default: 'Black Soil'
    },
    irrigationType: {
      type: String,
      trim: true,
      default: 'Drip Irrigation'
    },
    currentCrop: {
      type: String,
      trim: true,
      default: 'Soybean'
    },
    croppingSeason: {
      type: String,
      trim: true,
      default: 'Kharif 2026'
    },
    status: {
      type: String,
      enum: {
        values: ['Active Cultivation', 'Fallow', 'Harvested', 'Sowing Prep'],
        message: '{VALUE} is not a valid parcel status'
      },
      default: 'Active Cultivation'
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound index for querying a farmer's parcels by status
farmParcelSchema.index({ farmerId: 1, status: 1 });

/**
 * Instance method to convert document to clean API format
 */
farmParcelSchema.methods.toSafeObject = function (): IFarmParcel {
  const doc = this.toObject();
  return {
    id: doc._id.toString(),
    farmerId: doc.farmerId.toString(),
    name: doc.name,
    surveyNumber: doc.surveyNumber,
    village: doc.village,
    district: doc.district,
    state: doc.state,
    areaAcres: doc.areaAcres,
    soilType: doc.soilType,
    irrigationType: doc.irrigationType,
    currentCrop: doc.currentCrop,
    croppingSeason: doc.croppingSeason,
    status: doc.status as FarmParcelStatus,
    coordinates: doc.coordinates,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

export const FarmParcel: Model<IFarmParcelDocument> = model<IFarmParcelDocument>(
  'FarmParcel',
  farmParcelSchema
);
