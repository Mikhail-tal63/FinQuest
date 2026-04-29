const asyncHandler = require('../utils/asyncHandler')
const { ok, created, fail, notFound } = require('../utils/apiResponse')
const { isValidObjectId, requireFields } = require('../utils/validators')
const {
  startSession,
  getCurrentScenario,
  submitAnswer,
  getSessionResult,
} = require('../services/sessionService')

/**
 * POST /api/session/start
 * Body: { userId }
 */
const start = asyncHandler(async (req, res) => {
  const error = requireFields(req.body, ['userId'])
  if (error) return fail(res, error)

  const { userId } = req.body
  if (!isValidObjectId(userId)) return fail(res, 'Invalid userId')

  const session = await startSession(userId)
  created(res, session)
})

/**
 * GET /api/session/:sessionId/current
 */
const getCurrent = asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) return fail(res, 'Invalid sessionId')

  const scenario = await getCurrentScenario(sessionId)
  if (!scenario) return ok(res, null) // session completed or no more scenarios

  ok(res, scenario)
})

/**
 * POST /api/session/:sessionId/answer
 * Body: { choiceIndex }
 */
const answer = asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) return fail(res, 'Invalid sessionId')

  const error = requireFields(req.body, ['choiceIndex'])
  if (error) return fail(res, error)

  const { choiceIndex } = req.body
  if (typeof choiceIndex !== 'number' || choiceIndex < 0)
    return fail(res, 'choiceIndex must be a non-negative number')

  const result = await submitAnswer(sessionId, choiceIndex)
  ok(res, result)
})

/**
 * GET /api/session/:sessionId/result
 */
const result = asyncHandler(async (req, res) => {
  const { sessionId } = req.params
  if (!isValidObjectId(sessionId)) return fail(res, 'Invalid sessionId')

  const report = await getSessionResult(sessionId)
  ok(res, report)
})

module.exports = { start, getCurrent, answer, result }
