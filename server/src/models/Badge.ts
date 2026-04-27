import mongoose, { Schema, Document, Model } from 'mongoose';

// ─────────────────────────────────────────────
// Badge Interface
// ─────────────────────────────────────────────
export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string;
  conditionType: 'awareness' | 'security' | 'savings' | 'scenarios_completed' | 'balance';
  requiredScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// UserBadge Interface (join document)
// ─────────────────────────────────────────────
export interface IUserBadge extends Document {
  userId: mongoose.Types.ObjectId;
  badgeId: mongoose.Types.ObjectId;
  earnedAt: Date;
}

// ─────────────────────────────────────────────
// Badge Schema
// ─────────────────────────────────────────────
const BadgeSchema = new Schema<IBadge>(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
    },
    conditionType: {
      type: String,
      enum: ['awareness', 'security', 'savings', 'scenarios_completed', 'balance'],
      required: [true, 'Condition type is required'],
    },
    requiredScore: {
      type: Number,
      required: [true, 'Required score is required'],
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// UserBadge Schema
// ─────────────────────────────────────────────
const UserBadgeSchema = new Schema<IUserBadge>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  badgeId: {
    type: Schema.Types.ObjectId,
    ref: 'Badge',
    required: true,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicates – a user can only earn a badge once
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

// ─────────────────────────────────────────────
// Models
// ─────────────────────────────────────────────
export const Badge: Model<IBadge> = mongoose.model<IBadge>('Badge', BadgeSchema);
export const UserBadge: Model<IUserBadge> = mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
