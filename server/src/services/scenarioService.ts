import Scenario from '../models/Scenario';
import Attempt from '../models/Attempt';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

interface ProcessAnswerResult {
  attempt: InstanceType<typeof Attempt>;
  updatedUser: IUser;
}

/**
 * Validates the answer, creates an Attempt document,
 * and applies score/balance effects to the user.
 */
export const processAnswer = async (
  userId: string,
  scenarioId: string,
  choiceIndex: number
): Promise<ProcessAnswerResult> => {
  const scenario = await Scenario.findById(scenarioId);
  if (!scenario) throw new Error('Scenario not found');

  const choice = scenario.choices[choiceIndex];
  if (!choice) throw new Error('Invalid choice index');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Create the attempt record
  const attempt = await Attempt.create({
    userId: new mongoose.Types.ObjectId(userId),
    scenarioId: new mongoose.Types.ObjectId(scenarioId),
    selectedChoiceIndex: choiceIndex,
    isCorrect: choice.isCorrect,
    balanceEffect: choice.effects.balance,
    awarenessEffect: choice.effects.awareness,
    securityEffect: choice.effects.security,
    savingsEffect: choice.effects.savings,
    feedback: choice.feedback,
  });

  // Apply effects to user
  user.balance = Math.max(0, user.balance + choice.effects.balance);
  user.awarenessScore = Math.min(100, Math.max(0, user.awarenessScore + choice.effects.awareness));
  user.securityScore = Math.min(100, Math.max(0, user.securityScore + choice.effects.security));
  user.savingsProgress = Math.max(0, user.savingsProgress + choice.effects.savings);

  // Mark scenario as completed (avoid duplicates)
  const scenarioObjId = new mongoose.Types.ObjectId(scenarioId);
  const alreadyCompleted = user.completedScenarios.some((id) => id.equals(scenarioObjId));
  if (!alreadyCompleted) {
    user.completedScenarios.push(scenarioObjId);
  }

  await user.save();

  return { attempt: attempt as InstanceType<typeof Attempt>, updatedUser: user };
};
