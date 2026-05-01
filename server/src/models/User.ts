import mongoose, { Document, Schema } from 'mongoose'
import { Persona } from '../types'

export interface IUser extends Document {
  name: string
  email: string
  role: Persona
  balance: number
  xp: number
  securityScore: number
  awarenessScore: number
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ['student', 'employee', 'freelancer'],
      default: 'employee',
    },
    balance: { type: Number, default: 5000 },
    xp: { type: Number, default: 0 },
    securityScore: { type: Number, default: 50, min: 0, max: 100 },
    awarenessScore: { type: Number, default: 50, min: 0, max: 100 },
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>('User', userSchema)
export default User
