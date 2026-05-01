import Session, { ISession } from '../models/Session'
import Attempt from '../models/Attempt'
import Scenario from '../models/Scenario'
import User, { IUser } from '../models/User'
import { getScenariosByRole, getScenarioById, evaluateChoice } from './scenarioService'
import { applyEffects } from './userService'
import { IScenario } from '../models/Scenario'
import { Persona } from '../types'

const MONTHLY_SALARY: Record<Persona, number> = {
  student: 1200,
  employee: 3500,
  freelancer: 2800,
}

/**
 * Creates a new session for a user.
 * Resets user stats, assigns scenarios sorted by scheduledDay.
 */
export async function startSession(userId: string): Promise<ISession> {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const salary = MONTHLY_SALARY[user.role] ?? 2000
  await User.findByIdAndUpdate(userId, {
    balance: salary,
    xp: 0,
    securityScore: 50,
    awarenessScore: 50,
  })

  const scenarios = await getScenariosByRole(user.role)
  if (!scenarios.length) throw new Error('No scenarios available for this role')

  // Sort by scheduledDay so the session order matches the time system
  const ordered = [...scenarios].sort(
    (a, b) => (a.scheduledDay ?? 1) - (b.scheduledDay ?? 1)
  )
  const scenarioIds = ordered.map(s => s._id)

  const session = await Session.create({ userId, scenarioIds })
  return session
}

/**
 * Returns the current scenario document for a session (legacy, kept for compatibility).
 */
export async function getCurrentScenario(
  sessionId: string
): Promise<IScenario | null> {
  const session = await Session.findById(sessionId)
  if (!session) throw new Error('Session not found')
  if (session.status === 'completed') return null

  const scenarioId = session.scenarioIds[session.currentIndex]
  if (!scenarioId) return null

  return getScenarioById(scenarioId.toString())
}

/**
 * Returns all scenarios for a session in scheduledDay order.
 */
export async function getAllScenarios(sessionId: string): Promise<IScenario[]> {
  const session = await Session.findById(sessionId)
  if (!session) throw new Error('Session not found')

  const scenarios = await Scenario.find({
    _id: { $in: session.scenarioIds },
  }).select('-__v')

  type ScenarioDoc = (typeof scenarios)[number]
  const map = new Map<string, ScenarioDoc>(scenarios.map(s => [s._id.toString(), s]))
  return session.scenarioIds
    .map(id => map.get(id.toString()))
    .filter((s): s is ScenarioDoc => s !== undefined) as IScenario[]
}

export interface AnswerResult {
  result: string
  qualityLevel: string
  feedback: string
  timeline: unknown[]
  effectsApplied: object
  updatedUser: {
    _id: unknown
    balance: number
    xp: number
    securityScore: number
    awarenessScore: number
  }
  sessionStatus: string
  remainingScenarios: number
}

/**
 * Processes the user's answer for a specific scenario (by scenarioId).
 * Scenarios can now be answered in any order as long as they are revealed.
 */
export async function submitAnswer(
  sessionId: string,
  scenarioId: string,
  choiceIndex: number
): Promise<AnswerResult> {
  const session = await Session.findById(sessionId)
  if (!session) throw new Error('Session not found')

  // Verify the scenario belongs to this session
  const inSession = session.scenarioIds.some(id => id.toString() === scenarioId)
  if (!inSession) throw new Error('Scenario not in session')

  // Prevent double-answering
  const existing = await Attempt.findOne({ sessionId, scenarioId })
  if (existing) throw new Error('Scenario already answered')

  const scenario = await getScenarioById(scenarioId)
  if (!scenario) throw new Error('Scenario not found')

  const { qualityLevel, result, effects, timeline, feedback } = evaluateChoice(
    scenario,
    choiceIndex
  )

  const updatedUser = await applyEffects(session.userId.toString(), effects)

  await Attempt.create({
    sessionId,
    scenarioId,
    userId: session.userId,
    selectedChoice: choiceIndex,
    qualityLevel,
    result,
    effectsApplied: effects,
  })

  session.totalXP += effects.xp ?? 0

  const attemptCount = await Attempt.countDocuments({ sessionId })
  if (attemptCount >= session.scenarioIds.length) {
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
    remainingScenarios: session.scenarioIds.length - attemptCount,
  }
}

export interface SessionReport {
  session: {
    _id: unknown
    status: string
    totalXP: number
    scenariosTotal: number
    scenariosCompleted: number
    startedAt: Date
    completedAt: Date | null
  }
  finalStats: {
    balance: number
    xp: number
    securityScore: number
    awarenessScore: number
  }
  attempts: Array<{
    scenario: unknown
    selectedChoice: number
    qualityLevel: string | undefined
    result: string
    effectsApplied: object
  }>
}

/**
 * Builds the final result report for a session.
 */
export async function getSessionResult(sessionId: string): Promise<SessionReport> {
  const session = await Session.findById(sessionId).populate('userId', '-__v')
  if (!session) throw new Error('Session not found')

  const attempts = await Attempt.find({ sessionId }).populate(
    'scenarioId',
    'title type difficulty'
  )

  const user = session.userId as unknown as IUser

  return {
    session: {
      _id: session._id,
      status: session.status,
      totalXP: session.totalXP,
      scenariosTotal: session.scenarioIds.length,
      scenariosCompleted: attempts.length,
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
