import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string;
  conditionType: 'awareness' | 'security' | 'savings' | 'scenarios_completed' | 'balance' | 'xp' | 'risk_low';
  requiredScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBadge extends Document {
  userId: mongoose.Types.ObjectId;
  badgeId: mongoose.Types.ObjectId;
  earnedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    conditionType: {
      type: String,
      enum: ['awareness', 'security', 'savings', 'scenarios_completed', 'balance', 'xp', 'risk_low'],
      required: true,
    },
    requiredScore: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const UserBadgeSchema = new Schema<IUserBadge>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
  earnedAt: { type: Date, default: Date.now },
});

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const Badge: Model<IBadge> = mongoose.model<IBadge>('Badge', BadgeSchema);
export const UserBadge: Model<IUserBadge> = mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
