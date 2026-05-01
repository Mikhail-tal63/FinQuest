import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import { ok, fail, notFound } from '../utils/apiResponse'
import { isValidObjectId, requireFields } from '../utils/validators'
import {
  getScenariosBySource,
  getScenarioById,
  evaluateChoice,
} from '../services/scenarioService'
import { applyEffects } from '../services/userService'
import Attempt from '../models/Attempt'

/**
 * GET /api/scenarios?source=inbox
 * Returns scenarios filtered by source (used by existing frontend).
 */
export const getScenarios = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { source } = req.query as { source?: string }
    const scenarios = await getScenariosBySource(source ?? 'inbox')
    ok(res, scenarios)
  }
)

/**
 * GET /api/scenarios/:id
 */
export const getScenario = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!isValidObjectId(id)) { fail(res, 'Invalid scenario ID'); return }

    const scenario = await getScenarioById(id)
    if (!scenario) { notFound(res, 'Scenario not found'); return }

    ok(res, scenario)
  }
)

/**
 * POST /api/scenarios/answer
 * Body: { userId, scenarioId, choiceIndex }
 * Legacy endpoint used by the existing frontend (stateless, no session).
 */
export const submitAnswer = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as Record<string, unknown>
    const error = requireFields(body, ['userId', 'scenarioId', 'choiceIndex'])
    if (error) { fail(res, error); return }

    const { userId, scenarioId, choiceIndex } = body as {
      userId: string
      scenarioId: string
      choiceIndex: number
    }

    if (!isValidObjectId(userId)) { fail(res, 'Invalid userId'); return }
    if (!isValidObjectId(scenarioId)) { fail(res, 'Invalid scenarioId'); return }
    if (typeof choiceIndex !== 'number' || choiceIndex < 0) {
      fail(res, 'choiceIndex must be a non-negative number')
      return
    }

    const scenario = await getScenarioById(scenarioId)
    if (!scenario) { notFound(res, 'Scenario not found'); return }
    if (choiceIndex >= scenario.choices.length) {
      fail(res, 'choiceIndex out of range')
      return
    }

    const { qualityLevel, result, effects, timeline, feedback } = evaluateChoice(
      scenario,
      choiceIndex
    )

    const updatedUser = await applyEffects(userId, effects)

    // Persist attempt without a session (sessionId omitted)
    await Attempt.create({
      sessionId: null,
      scenarioId,
      userId,
      selectedChoice: choiceIndex,
      qualityLevel,
      result,
      effectsApplied: effects,
    })

    ok(res, {
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
    })
  }
)
