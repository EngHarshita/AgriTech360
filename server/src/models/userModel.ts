import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserDocument, IUserModel, ISafeUser, UserRole } from '../types';
import { config } from '../config';

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Excluded from default queries for security
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
    landHolding: {
      type: Number,
      required: [true, 'Land holding size is required'],
      min: [0, 'Land holding must be a non-negative number']
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      trim: true
    },
    irrigationType: {
      type: String,
      required: [true, 'Irrigation type is required'],
      trim: true
    },
    role: {
      type: String,
      enum: ['farmer', 'expert', 'buyer', 'admin'] as UserRole[],
      default: 'farmer'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.password;
        delete ret.__v;
        ret.id = (ret._id as { toString(): string })?.toString() ?? ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

// Pre-save middleware for automatic password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

// Instance method to verify passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to return safe user representation
userSchema.methods.toSafeObject = function (): ISafeUser {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    district: this.district,
    state: this.state,
    landHolding: this.landHolding,
    soilType: this.soilType,
    irrigationType: this.irrigationType,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const User = model<IUserDocument, IUserModel>('User', userSchema);
