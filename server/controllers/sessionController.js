const asyncHandler = require('../utils/asyncHandler')
const { ok, created, fail } = require('../utils/apiResponse')
const { isValidObjectId, requireFields } = require('../utils/validators')
const {
  startSession,
  getCurrentScenario,
  getAllScenarios,
  submitAnswer,
  getSessionResult,
} = require('../services/sessionService')

/** POST /api/session/start */
const start = asyncHandler(async (req, res) => {
  const error = requireFields(req.body, ['userId'])
  if (error) return fail(res, error)
  const { userId } = req.body
  if (!isValidObjectId(userId)) return fail(res, 'Invalid userId')
  const session = await startSession(userId)
  created(res, session)
})

/** GET /api/session/:sessionId/current */
const getCurrent = asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) return fail(res, 'Invalid sessionId')
  const scenario = await getCurrentScenario(sessionId)
  ok(res, scenario)
})

/** GET /api/session/:sessionId/scenarios */
const getScenarios = asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) return fail(res, 'Invalid sessionId')
  const scenarios = await getAllScenarios(sessionId)
  ok(res, scenarios)
})

/** POST /api/session/:sessionId/answer  — body: { scenarioId, choiceIndex } */
const answer = asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) return fail(res, 'Invalid sessionId')

  const error = requireFields(req.body, ['scenarioId', 'choiceIndex'])
  if (error) return fail(res, error)

  const { scenarioId, choiceIndex } = req.body
  if (!isValidObjectId(scenarioId)) return fail(res, 'Invalid scenarioId')
  if (typeof choiceIndex !== 'number' || choiceIndex < 0)
    return fail(res, 'choiceIndex must be a non-negative number')

  const result = await submitAnswer(sessionId, scenarioId, choiceIndex)
  ok(res, result)
})

/** GET /api/session/:sessionId/result */
const result = asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) return fail(res, 'Invalid sessionId')
  const report = await getSessionResult(sessionId)
  ok(res, report)
})

module.exports = { start, getCurrent, getScenarios, answer, result }
