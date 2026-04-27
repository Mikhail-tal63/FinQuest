import mongoose, { Schema, Document, Model } from 'mongoose';

// ─────────────────────────────────────────────
// Interface
// ─────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  role: 'student' | 'employee' | 'freelancer';
  balance: number;
  awarenessScore: number;
  securityScore: number;
  savingsProgress: number;
  completedScenarios: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'employee', 'freelancer'],
      required: [true, 'Role is required'],
    },
    balance: {
      type: Number,
      default: 1000,
    },
    awarenessScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    securityScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    savingsProgress: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedScenarios: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Scenario',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// Model
// ─────────────────────────────────────────────
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
