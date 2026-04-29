const asyncHandler = require('../utils/asyncHandler')
const { ok, fail, notFound } = require('../utils/apiResponse')
const { isValidObjectId, requireFields } = require('../utils/validators')
const { getScenariosBySource, getScenarioById, evaluateChoice } = require('../services/scenarioService')
const { applyEffects } = require('../services/userService')
const Attempt = require('../models/Attempt')

/**
 * GET /api/scenarios?source=inbox
 * Returns scenarios filtered by source (used by existing frontend).
 */
const getScenarios = asyncHandler(async (req, res) => {
  const { source } = req.query
  const scenarios = await getScenariosBySource(source ?? 'inbox')
  ok(res, scenarios)
})

/**
 * GET /api/scenarios/:id
 */
const getScenario = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) return fail(res, 'Invalid scenario ID')

  const scenario = await getScenarioById(id)
  if (!scenario) return notFound(res, 'Scenario not found')

  ok(res, scenario)
})

/**
 * POST /api/scenarios/answer
 * Body: { userId, scenarioId, choiceIndex }
 * Legacy endpoint used by the existing frontend (stateless, no session).
 */
const submitAnswer = asyncHandler(async (req, res) => {
  const error = requireFields(req.body, ['userId', 'scenarioId', 'choiceIndex'])
  if (error) return fail(res, error)

  const { userId, scenarioId, choiceIndex } = req.body

  if (!isValidObjectId(userId)) return fail(res, 'Invalid userId')
  if (!isValidObjectId(scenarioId)) return fail(res, 'Invalid scenarioId')
  if (typeof choiceIndex !== 'number' || choiceIndex < 0) return fail(res, 'choiceIndex must be a non-negative number')

  const scenario = await getScenarioById(scenarioId)
  if (!scenario) return notFound(res, 'Scenario not found')
  if (choiceIndex >= scenario.choices.length) return fail(res, 'choiceIndex out of range')

  const { qualityLevel, result, effects, timeline, feedback } = evaluateChoice(scenario, choiceIndex)

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
})

module.exports = { getScenarios, getScenario, submitAnswer }
