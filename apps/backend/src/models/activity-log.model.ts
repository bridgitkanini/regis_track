import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';

export type ActionType = 'create' | 'update' | 'delete' | 'login' | 'logout';
export type CollectionType = 'User' | 'Member' | 'Role';

export interface IActivityLog extends Document {
  action: ActionType;
  collectionName: CollectionType;
  documentId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId | IUser;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete', 'login', 'logout'],
    },
    collectionName: {
      type: String,
      required: true,
      enum: ['User', 'Member', 'Role'],
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  }
);

// Indexes for faster querying
activityLogSchema.index({ collectionName: 1, documentId: 1 });
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ timestamp: -1 });

export const ActivityLog = model<IActivityLog>('ActivityLog', activityLogSchema);
