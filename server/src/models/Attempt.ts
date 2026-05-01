import mongoose, { Document, Schema, Types } from 'mongoose'
import { QualityLevel, Effects } from '../types'

export interface IAttempt extends Document {
  sessionId: Types.ObjectId | null
  scenarioId: Types.ObjectId
  userId: Types.ObjectId
  selectedChoice: number
  qualityLevel?: QualityLevel
  result: 'correct' | 'incorrect' | 'partial'
  effectsApplied: Partial<Effects>
  createdAt: Date
  updatedAt: Date
}

const attemptSchema = new Schema<IAttempt>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', default: null },
    scenarioId: { type: Schema.Types.ObjectId, ref: 'Scenario', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    selectedChoice: { type: Number, required: true },
    qualityLevel: { type: String, enum: ['best', 'average', 'worst'] },
    result: { type: String, enum: ['correct', 'incorrect', 'partial'], required: true },
    effectsApplied: {
      xp: { type: Number, default: 0 },
      securityScore: { type: Number, default: 0 },
      awarenessScore: { type: Number, default: 0 },
      balance: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

export const Attempt = mongoose.model<IAttempt>('Attempt', attemptSchema)
export default Attempt
