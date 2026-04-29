import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  role: 'student' | 'employee' | 'freelancer';
  balance: number;
  awarenessScore: number;
  securityScore: number;
  savingsProgress: number;
  riskLevel: number;            // 0-100: how exposed the user currently is
  xp: number;                   // experience points gained per correct decision
  decisionQualityScore: number; // 0-100: tracks quality of reasoning
  mistakeTags: string[];        // e.g. ['phishing', 'impulse_spending']
  completedScenarios: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

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
    balance: { type: Number, default: 1000 },
    awarenessScore: { type: Number, default: 50, min: 0, max: 100 },
    securityScore: { type: Number, default: 50, min: 0, max: 100 },
    savingsProgress: { type: Number, default: 0, min: 0 },
    riskLevel: { type: Number, default: 0, min: 0, max: 100 },
    xp: { type: Number, default: 0, min: 0 },
    decisionQualityScore: { type: Number, default: 50, min: 0, max: 100 },
    mistakeTags: [{ type: String }],
    completedScenarios: [{ type: Schema.Types.ObjectId, ref: 'Scenario' }],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;
