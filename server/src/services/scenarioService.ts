import Scenario from '../models/Scenario';
import Attempt from '../models/Attempt';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

// XP awarded per quality level
const XP_MAP = { best: 30, average: 15, worst: 0 };
// Risk level delta per quality level
const RISK_MAP = { best: -15, average: 0, worst: 20 };
// Decision quality score delta
const DQ_MAP = { best: 10, average: 2, worst: -8 };

interface ProcessResult {
  attempt: InstanceType<typeof Attempt>;
  updatedUser: IUser;
  timeline: { day: number; event: string; isPositive: boolean }[];
}

export const processAnswer = async (
  userId: string,
  scenarioId: string,
  choiceIndex: number,
  reasonIndex: number = -1
): Promise<ProcessResult> => {
  const scenario = await Scenario.findById(scenarioId);
  if (!scenario) throw new Error('Scenario not found');

  const choice = scenario.choices[choiceIndex];
  if (!choice) throw new Error('Invalid choice index');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const { qualityLevel } = choice;
  const xpGained = XP_MAP[qualityLevel];
  const riskDelta = RISK_MAP[qualityLevel];
  const dqDelta = DQ_MAP[qualityLevel];

  // Reason correctness
  let reasonIsCorrect = false;
  if (reasonIndex >= 0 && scenario.reasonOptions[reasonIndex]) {
    reasonIsCorrect = scenario.reasonOptions[reasonIndex].isCorrect;
    if (reasonIsCorrect) user.xp += 10; // bonus XP for correct reasoning
  }

  // Save attempt
  const attempt = await Attempt.create({
    userId: new mongoose.Types.ObjectId(userId),
    scenarioId: new mongoose.Types.ObjectId(scenarioId),
    selectedChoiceIndex: choiceIndex,
    qualityLevel,
    selectedReasonIndex: reasonIndex,
    reasonIsCorrect,
    balanceEffect: choice.effects.balance,
    awarenessEffect: choice.effects.awareness,
    securityEffect: choice.effects.security,
    savingsEffect: choice.effects.savings,
    riskLevelEffect: riskDelta,
    xpGained,
    feedback: choice.feedback,
  });

  // Apply effects to user
  user.balance = Math.max(0, user.balance + choice.effects.balance);
  user.awarenessScore = Math.min(100, Math.max(0, user.awarenessScore + choice.effects.awareness));
  user.securityScore = Math.min(100, Math.max(0, user.securityScore + choice.effects.security));
  user.savingsProgress = Math.max(0, user.savingsProgress + choice.effects.savings);
  user.riskLevel = Math.min(100, Math.max(0, user.riskLevel + riskDelta));
  user.xp += xpGained;
  user.decisionQualityScore = Math.min(100, Math.max(0, user.decisionQualityScore + dqDelta));

  // Track mistake tags
  if (qualityLevel === 'worst' && choice.mistakeTag) {
    user.mistakeTags.push(choice.mistakeTag);
  }

  // Mark scenario completed (no duplicates)
  const sid = new mongoose.Types.ObjectId(scenarioId);
  if (!user.completedScenarios.some((id) => id.equals(sid))) {
    user.completedScenarios.push(sid);
  }

  await user.save();

  return {
    attempt: attempt as InstanceType<typeof Attempt>,
    updatedUser: user,
    timeline: choice.timeline,
  };
};
