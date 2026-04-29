const User = require('../models/User')

/**
 * Clamps a numeric stat to [min, max].
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/**
 * Applies an effects object to a user document and saves it.
 * Returns the updated user.
 */
async function applyEffects(userId, effects) {
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

async function getAllUsers() {
  return User.find().select('-__v')
}

async function getUserById(id) {
  return User.findById(id).select('-__v')
}

async function createUser(data) {
  return User.create(data)
}

module.exports = { applyEffects, getAllUsers, getUserById, createUser }
