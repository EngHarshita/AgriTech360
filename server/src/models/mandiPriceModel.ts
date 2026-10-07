import { Schema, model, Model } from 'mongoose';
import { IMandiPriceDocument, IMandiPrice, MandiCategory } from '../types';

const mandiPriceSchema = new Schema<IMandiPriceDocument>(
  {
    commodity: {
      type: String,
      required: [true, 'Commodity name is required'],
      trim: true,
      index: true
    },
    hindiName: {
      type: String,
      trim: true
    },
    variety: {
      type: String,
      default: 'Common',
      trim: true
    },
    market: {
      type: String,
      required: [true, 'APMC market name is required'],
      trim: true,
      index: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      index: true
    },
    modalPrice: {
      type: Number,
      required: [true, 'Modal price is required'],
      min: [0, 'Modal price must be non-negative']
    },
    minPrice: {
      type: Number,
      required: [true, 'Minimum price is required'],
      min: [0, 'Minimum price must be non-negative']
    },
    maxPrice: {
      type: Number,
      required: [true, 'Maximum price is required'],
      min: [0, 'Maximum price must be non-negative']
    },
    msp: {
      type: Number,
      default: 0,
      min: 0
    },
    priceChange: {
      type: Number,
      default: 0
    },
    volumeTradedTons: {
      type: Number,
      default: 0,
      min: 0
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable'
    },
    category: {
      type: String,
      enum: ['Grains', 'Pulses', 'Oilseeds', 'Commercial', 'Spices', 'Vegetables', 'Fruits'] as MandiCategory[],
      required: [true, 'Commodity category is required'],
      index: true
    },
    lastUpdated: {
      type: String,
      default: () => new Date().toISOString().split('T')[0] ?? '2026-10-08'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as { toString(): string })?.toString() ?? ret._id;
        delete ret._id;
        delete ret.__v;
        const modal = Number(ret.modalPrice) || 0;
        const mspVal = Number(ret.msp) || 0;
        ret.mspDifference = modal - mspVal;
        ret.isAboveMsp = modal >= mspVal;
        return ret;
      }
    }
  }
);

// Compound and text indexes for optimal query performance
mandiPriceSchema.index({
  commodity: 'text',
  market: 'text',
  district: 'text',
  state: 'text',
  variety: 'text'
});

mandiPriceSchema.index({ state: 1, category: 1 });
mandiPriceSchema.index({ commodity: 1, market: 1 });

mandiPriceSchema.methods.toSafeObject = function (): IMandiPrice {
  const modal = this.modalPrice;
  const mspVal = this.msp || 0;
  return {
    id: this._id.toString(),
    commodity: this.commodity,
    hindiName: this.hindiName,
    variety: this.variety,
    market: this.market,
    district: this.district,
    state: this.state,
    modalPrice: modal,
    minPrice: this.minPrice,
    maxPrice: this.maxPrice,
    msp: mspVal,
    priceChange: this.priceChange,
    volumeTradedTons: this.volumeTradedTons,
    trend: this.trend,
    category: this.category,
    lastUpdated: this.lastUpdated,
    mspDifference: modal - mspVal,
    isAboveMsp: modal >= mspVal,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const MandiPrice: Model<IMandiPriceDocument> = model<IMandiPriceDocument>(
  'MandiPrice',
  mandiPriceSchema
);
