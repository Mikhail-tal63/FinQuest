import Scenario, { IScenario } from '../models/Scenario'
import { EvaluateChoiceResult } from '../types'

export async function getScenariosByRole(role: string): Promise<IScenario[]> {
  return Scenario.find({ targetRoles: role }).select('-__v')
}

export async function getScenariosBySource(source: string): Promise<IScenario[]> {
  return Scenario.find({ source }).select('-__v')
}

export async function getScenarioById(id: string): Promise<IScenario | null> {
  return Scenario.findById(id).select('-__v')
}

/**
 * Evaluate a choice and derive result label + effects.
 * Returns { qualityLevel, result, effects, timeline, feedback }.
 */
export function evaluateChoice(
  scenario: IScenario,
  choiceIndex: number
): EvaluateChoiceResult {
  const choice = scenario.choices[choiceIndex]
  if (!choice) throw new Error('Invalid choice index')

  const result: EvaluateChoiceResult['result'] =
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
