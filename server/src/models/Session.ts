import mongoose, { Document, Schema, Types } from 'mongoose'

export interface ISession extends Document {
  userId: Types.ObjectId
  scenarioIds: Types.ObjectId[]
  currentIndex: number
  status: 'in_progress' | 'completed'
  totalXP: number
  startedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  isFinished: boolean
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scenarioIds: [{ type: Schema.Types.ObjectId, ref: 'Scenario' }],
    currentIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    totalXP: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
)

sessionSchema.virtual('isFinished').get(function (this: ISession): boolean {
  return this.currentIndex >= this.scenarioIds.length
})

export const Session = mongoose.model<ISession>('Session', sessionSchema)
export default Session
