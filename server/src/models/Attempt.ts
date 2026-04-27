import mongoose, { Schema, Document, Model } from 'mongoose';

// ─────────────────────────────────────────────
// Interface
// ─────────────────────────────────────────────
export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  scenarioId: mongoose.Types.ObjectId;
  selectedChoiceIndex: number;
  isCorrect: boolean;
  balanceEffect: number;
  awarenessEffect: number;
  securityEffect: number;
  savingsEffect: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const AttemptSchema = new Schema<IAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    scenarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Scenario',
      required: [true, 'scenarioId is required'],
    },
    selectedChoiceIndex: {
      type: Number,
      required: [true, 'selectedChoiceIndex is required'],
      min: 0,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    balanceEffect: {
      type: Number,
      default: 0,
    },
    awarenessEffect: {
      type: Number,
      default: 0,
    },
    securityEffect: {
      type: Number,
      default: 0,
    },
    savingsEffect: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// Model
// ─────────────────────────────────────────────
const Attempt: Model<IAttempt> = mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
