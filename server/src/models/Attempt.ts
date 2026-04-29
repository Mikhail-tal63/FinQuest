import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  scenarioId: mongoose.Types.ObjectId;
  selectedChoiceIndex: number;
  qualityLevel: 'best' | 'average' | 'worst';
  // Reason Behind Decision
  selectedReasonIndex: number;
  reasonIsCorrect: boolean;
  // Applied effects
  balanceEffect: number;
  awarenessEffect: number;
  securityEffect: number;
  savingsEffect: number;
  riskLevelEffect: number;
  xpGained: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scenarioId: { type: Schema.Types.ObjectId, ref: 'Scenario', required: true },
    selectedChoiceIndex: { type: Number, required: true, min: 0 },
    qualityLevel: { type: String, enum: ['best', 'average', 'worst'], required: true },
    selectedReasonIndex: { type: Number, default: -1 },
    reasonIsCorrect: { type: Boolean, default: false },
    balanceEffect: { type: Number, default: 0 },
    awarenessEffect: { type: Number, default: 0 },
    securityEffect: { type: Number, default: 0 },
    savingsEffect: { type: Number, default: 0 },
    riskLevelEffect: { type: Number, default: 0 },
    xpGained: { type: Number, default: 0 },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

const Attempt: Model<IAttempt> = mongoose.model<IAttempt>('Attempt', AttemptSchema);
export default Attempt;
