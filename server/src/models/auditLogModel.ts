import { Schema, model, Document } from 'mongoose';

export interface IAuditLogDocument extends Document {
  action: string;
  performedBy: string;
  performedByEmail: string;
  targetId?: string;
  targetType?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: {
      type: String,
      required: true,
      trim: true
    },
    performedBy: {
      type: String,
      required: true
    },
    performedByEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    targetId: {
      type: String,
      trim: true
    },
    targetType: {
      type: String,
      trim: true,
      default: 'User'
    },
    details: {
      type: Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      trim: true,
      default: 'internal'
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Index for rapid queries and chronological audit reviews
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ performedBy: 1, createdAt: -1 });

export const AuditLog = model<IAuditLogDocument>('AuditLog', auditLogSchema);
