import { Request, Response } from 'express';
import Scenario from '../models/Scenario';
import { processAnswer } from '../services/scenarioService';
import { updateScores } from '../services/scoreService';
import { checkAndAwardBadges } from '../services/badgeService';

// ─────────────────────────────────────────────
// GET /api/scenarios
// Query params: role, source
// ─────────────────────────────────────────────
export const getScenarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, source } = req.query;
    const filter: Record<string, unknown> = {};

    if (role) filter.role = { $in: [role, 'all'] };
    if (source) filter.source = source;

    const scenarios = await Scenario.find(filter);
    res.json({ success: true, data: scenarios });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// ─────────────────────────────────────────────
// GET /api/scenarios/:id
// ─────────────────────────────────────────────
export const getScenarioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const scenario = await Scenario.findById(req.params.id);

    if (!scenario) {
      res.status(404).json({ success: false, message: 'Scenario not found' });
      return;
    }

    res.json({ success: true, data: scenario });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// ─────────────────────────────────────────────
// POST /api/scenarios/answer
// Body: { userId, scenarioId, choiceIndex }
// ─────────────────────────────────────────────
export const answerScenario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, scenarioId, choiceIndex } = req.body;

    if (userId === undefined || scenarioId === undefined || choiceIndex === undefined) {
      res.status(400).json({ success: false, message: 'userId, scenarioId and choiceIndex are required' });
      return;
    }

    // Process the answer and save the attempt
    const { attempt, updatedUser } = await processAnswer(userId, scenarioId, choiceIndex);

    // Update user scores
    await updateScores(updatedUser);

    // Check if any new badges were earned
    const newBadges = await checkAndAwardBadges(updatedUser);

    res.status(201).json({
      success: true,
      data: {
        attempt,
        updatedUser,
        newBadges,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message, error });
  }
};
