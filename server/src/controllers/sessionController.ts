import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import { ok, created, fail } from '../utils/apiResponse'
import { isValidObjectId, requireFields } from '../utils/validators'
import {
  startSession,
  getCurrentScenario,
  getAllScenarios,
  submitAnswer,
  getSessionResult,
} from '../services/sessionService'

/** POST /api/session/start */
export const start = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Record<string, unknown>
  const error = requireFields(body, ['userId'])
  if (error) { fail(res, error); return }

  const { userId } = body as { userId: string }
  if (!isValidObjectId(userId)) { fail(res, 'Invalid userId'); return }

  const session = await startSession(userId)
  created(res, session)
})

/** GET /api/session/:sessionId/current */
export const getCurrent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params
    if (!isValidObjectId(sessionId)) { fail(res, 'Invalid sessionId'); return }

    const scenario = await getCurrentScenario(sessionId)
    ok(res, scenario)
  }
)

/** GET /api/session/:sessionId/scenarios */
export const getScenarios = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params
    if (!isValidObjectId(sessionId)) { fail(res, 'Invalid sessionId'); return }

    const scenarios = await getAllScenarios(sessionId)
    ok(res, scenarios)
  }
)

/** POST /api/session/:sessionId/answer  — body: { scenarioId, choiceIndex } */
export const answer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) { fail(res, 'Invalid sessionId'); return }

  const body = req.body as Record<string, unknown>
  const error = requireFields(body, ['scenarioId', 'choiceIndex'])
  if (error) { fail(res, error); return }

  const { scenarioId, choiceIndex } = body as {
    scenarioId: string
    choiceIndex: number
  }
  if (!isValidObjectId(scenarioId)) { fail(res, 'Invalid scenarioId'); return }
  if (typeof choiceIndex !== 'number' || choiceIndex < 0) {
    fail(res, 'choiceIndex must be a non-negative number')
    return
  }

  const result = await submitAnswer(sessionId, scenarioId, choiceIndex)
  ok(res, result)
})

/** GET /api/session/:sessionId/result */
export const result = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) { fail(res, 'Invalid sessionId'); return }

  const report = await getSessionResult(sessionId)
  ok(res, report)
})
