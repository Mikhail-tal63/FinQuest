const Session = require('../models/Session')
const Attempt = require('../models/Attempt')
const { getScenariosByRole, getScenarioById, evaluateChoice } = require('./scenarioService')
const { applyEffects } = require('./userService')
const User = require('../models/User')

/**
 * Creates a new session for a user.
 * Selects scenarios matching the user's role, shuffles them.
 */
async function startSession(userId) {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const scenarios = await getScenariosByRole(user.role)
  if (!scenarios.length) throw new Error('No scenarios available for this role')

  // Shuffle inbox scenarios for variety, then put wallet scenarios first
  const walletScenarios = scenarios.filter(s => s.source === 'wallet')
  const inboxScenarios = scenarios.filter(s => s.source !== 'wallet').sort(() => Math.random() - 0.5)
  const ordered = [...walletScenarios, ...inboxScenarios]
  const scenarioIds = ordered.map(s => s._id)

  const session = await Session.create({ userId, scenarioIds })
  return session
}

/**
 * Returns the current scenario document for a session.
 * Returns null if the session is already completed.
 */
async function getCurrentScenario(sessionId) {
  const session = await Session.findById(sessionId)
  if (!session) throw new Error('Session not found')
  if (session.status === 'completed') return null

  const scenarioId = session.scenarioIds[session.currentIndex]
  if (!scenarioId) return null

  return getScenarioById(scenarioId)
}

/**
 * Processes the user's answer for the current scenario.
 * Applies effects, saves attempt, advances index, marks complete if done.
 */
async function submitAnswer(sessionId, choiceIndex) {
  const session = await Session.findById(sessionId)
  if (!session) throw new Error('Session not found')
  if (session.status === 'completed') throw new Error('Session already completed')

  const scenarioId = session.scenarioIds[session.currentIndex]
  const scenario = await getScenarioById(scenarioId)
  if (!scenario) throw new Error('Scenario not found')

  const { qualityLevel, result, effects, timeline, feedback } = evaluateChoice(scenario, choiceIndex)

  // Apply stat changes to the user
  const updatedUser = await applyEffects(session.userId, effects)

  // Record the attempt
  await Attempt.create({
    sessionId,
    scenarioId,
    userId: session.userId,
    selectedChoice: choiceIndex,
    qualityLevel,
    result,
    effectsApplied: effects,
  })

  // Accumulate XP on the session
  session.totalXP += effects.xp ?? 0
  session.currentIndex += 1

  // Mark session complete when all scenarios are done
  if (session.currentIndex >= session.scenarioIds.length) {
    session.status = 'completed'
    session.completedAt = new Date()
  }

  await session.save()

  return {
    result,
    qualityLevel,
    feedback,
    timeline,
    effectsApplied: effects,
    updatedUser: {
      _id: updatedUser._id,
      balance: updatedUser.balance,
      xp: updatedUser.xp,
      securityScore: updatedUser.securityScore,
      awarenessScore: updatedUser.awarenessScore,
    },
    sessionStatus: session.status,
    remainingScenarios: session.scenarioIds.length - session.currentIndex,
  }
}

/**
 * Builds the final result report for a completed (or in-progress) session.
 */
async function getSessionResult(sessionId) {
  const session = await Session.findById(sessionId).populate('userId', '-__v')
  if (!session) throw new Error('Session not found')

  const attempts = await Attempt.find({ sessionId }).populate('scenarioId', 'title type difficulty')

  const user = session.userId

  return {
    session: {
      _id: session._id,
      status: session.status,
      totalXP: session.totalXP,
      scenariosTotal: session.scenarioIds.length,
      scenariosCompleted: session.currentIndex,
      startedAt: session.startedAt,
      completedAt: session.completedAt ?? null,
    },
    finalStats: {
      balance: user.balance,
      xp: user.xp,
      securityScore: user.securityScore,
      awarenessScore: user.awarenessScore,
    },
    attempts: attempts.map(a => ({
      scenario: a.scenarioId,
      selectedChoice: a.selectedChoice,
      qualityLevel: a.qualityLevel,
      result: a.result,
      effectsApplied: a.effectsApplied,
    })),
  }
}

module.exports = { startSession, getCurrentScenario, submitAnswer, getSessionResult }
