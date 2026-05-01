const Scenario = require('../models/Scenario')

async function getScenariosByRole(role) {
  return Scenario.find({ targetRoles: role }).select('-__v')
}

async function getScenariosBySource(source) {
  return Scenario.find({ source }).select('-__v')
}

async function getScenarioById(id) {
  return Scenario.findById(id).select('-__v')
}

/**
 * Evaluate a choice and derive result label + effects.
 * Returns { qualityLevel, result, effects, timeline }.
 */
function evaluateChoice(scenario, choiceIndex) {
  const choice = scenario.choices[choiceIndex]
  if (!choice) throw new Error('Invalid choice index')

  const result =
    choice.qualityLevel === 'best'
      ? 'correct'
      : choice.qualityLevel === 'average'
      ? 'partial'
      : 'incorrect'

  return {
    qualityLevel: choice.qualityLevel,
    result,
    effects: choice.effects ?? {},
    timeline: choice.timeline ?? [],
    feedback: choice.feedback,
  }
}

module.exports = { getScenariosByRole, getScenariosBySource, getScenarioById, evaluateChoice }
