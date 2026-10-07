import { Schema, model, Model } from 'mongoose';
import {
  IGovernmentSchemeDocument,
  IGovernmentScheme,
  SchemeCategory
} from '../types';

const eligibilityRulesSchema = new Schema(
  {
    targetStates: {
      type: [String],
      default: ['All']
    },
    minLandHolding: {
      type: Number,
      default: 0
    },
    maxLandHolding: {
      type: Number,
      default: 9999
    },
    targetIrrigationTypes: {
      type: [String],
      default: ['All']
    },
    targetSoilTypes: {
      type: [String],
      default: ['All']
    }
  },
  { _id: false }
);

const governmentSchemeSchema = new Schema<IGovernmentSchemeDocument>(
  {
    title: {
      type: String,
      required: [true, 'Scheme title is required'],
      trim: true,
      index: true
    },
    shortCode: {
      type: String,
      trim: true,
      index: true
    },
    department: {
      type: String,
      default: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Financial Assistance',
        'Crop Insurance',
        'Irrigation & Machinery',
        'Soil & Fertilizers',
        'Organic Farming',
        'Solar Energy',
        'Credit & Loans',
        'Infrastructure',
        'General Agriculture'
      ] as SchemeCategory[],
      required: [true, 'Scheme category is required'],
      index: true
    },
    subsidyAmount: {
      type: String,
      default: 'Direct Benefit Transfer / Subsidized Interest'
    },
    targetBeneficiaries: {
      type: String,
      default: 'Small, Marginal & Commercial Farmers across India'
    },
    description: {
      type: String,
      required: [true, 'Scheme description is required'],
      trim: true
    },
    benefits: {
      type: [String],
      default: []
    },
    keyBenefits: {
      type: [String],
      default: []
    },
    eligibility: {
      type: [String],
      default: []
    },
    eligibilityCriteria: {
      type: [String],
      default: []
    },
    requiredDocuments: {
      type: [String],
      default: []
    },
    documentsRequired: {
      type: [String],
      default: []
    },
    officialWebsite: {
      type: String,
      required: [true, 'Official website or portal URL is required'],
      trim: true
    },
    officialPortalUrl: {
      type: String,
      default: ''
    },
    applicationProcess: {
      type: String,
      required: [true, 'Application process description is required']
    },
    deadline: {
      type: String,
      default: 'Active Enrollment 2026-27'
    },
    status: {
      type: String,
      enum: ['Open', 'Upcoming', 'Active Enrollment'],
      default: 'Active Enrollment'
    },
    isPopular: {
      type: Boolean,
      default: true
    },
    bookmarkCount: {
      type: Number,
      default: 0,
      min: 0
    },
    bookmarkedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    eligibilityRules: {
      type: eligibilityRulesSchema,
      default: () => ({})
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
        return ret;
      }
    }
  }
);

// Full-text search and filtering indexes
governmentSchemeSchema.index({
  title: 'text',
  shortCode: 'text',
  description: 'text',
  category: 'text',
  department: 'text'
});

governmentSchemeSchema.index({ category: 1, bookmarkCount: -1 });

governmentSchemeSchema.methods.toSafeObject = function (userId?: string): IGovernmentScheme {
  const isBookmarked = userId
    ? this.bookmarkedBy.some((id: { toString(): string }) => id.toString() === userId)
    : false;

  const benefitsList = this.benefits.length > 0 ? this.benefits : this.keyBenefits;
  const eligibilityList = this.eligibility.length > 0 ? this.eligibility : this.eligibilityCriteria;
  const docsList = this.requiredDocuments.length > 0 ? this.requiredDocuments : this.documentsRequired;

  return {
    id: this._id.toString(),
    title: this.title,
    shortCode: this.shortCode || this.title.split(' ')[0],
    department: this.department,
    category: this.category,
    subsidyAmount: this.subsidyAmount,
    targetBeneficiaries: this.targetBeneficiaries,
    description: this.description,
    benefits: benefitsList,
    keyBenefits: benefitsList,
    eligibility: eligibilityList,
    eligibilityCriteria: eligibilityList,
    requiredDocuments: docsList,
    documentsRequired: docsList,
    officialWebsite: this.officialWebsite,
    officialPortalUrl: this.officialPortalUrl || this.officialWebsite,
    applicationProcess: this.applicationProcess,
    deadline: this.deadline,
    status: this.status,
    isPopular: this.isPopular,
    bookmarkCount: this.bookmarkCount || 0,
    isBookmarked,
    eligibilityRules: this.eligibilityRules,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const GovernmentScheme: Model<IGovernmentSchemeDocument> = model<IGovernmentSchemeDocument>(
  'GovernmentScheme',
  governmentSchemeSchema
);
