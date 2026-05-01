import User, { IUser } from '../models/User'
import { Effects } from '../types'

/**
 * Clamps a numeric stat to [min, max].
 */
const clamp = (val: number, min: number, max: number): number =>
  Math.min(Math.max(val, min), max)

/**
 * Applies an effects object to a user document and saves it.
 * Returns the updated user.
 */
export async function applyEffects(
  userId: string,
  effects: Partial<Effects>
): Promise<IUser> {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  if (effects.xp) user.xp += effects.xp
  if (effects.balance) user.balance += effects.balance
  if (effects.securityScore)
    user.securityScore = clamp(user.securityScore + effects.securityScore, 0, 100)
  if (effects.awarenessScore)
    user.awarenessScore = clamp(user.awarenessScore + effects.awarenessScore, 0, 100)

  await user.save()
  return user
}

export async function getAllUsers(): Promise<IUser[]> {
  return User.find().select('-__v')
}

export async function getUserById(id: string): Promise<IUser | null> {
  return User.findById(id).select('-__v')
}

export async function createUser(data: {
  name: string
  email: string
  role: string
  balance?: number
}): Promise<IUser> {
  return User.create(data)
}
