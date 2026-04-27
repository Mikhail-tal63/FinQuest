import { IUser } from '../models/User';

/**
 * scoreService
 *
 * Clamps all score fields to their valid ranges and persists the user.
 * Called after processAnswer has already applied raw deltas.
 * Extracted as a service so bonus/penalty formulas can be added here later
 * without touching the controller.
 */
export const updateScores = async (user: IUser): Promise<IUser> => {
  // Scores are already clamped inside processAnswer, but we double-guard here
  user.awarenessScore = Math.min(100, Math.max(0, user.awarenessScore));
  user.securityScore = Math.min(100, Math.max(0, user.securityScore));
  user.savingsProgress = Math.max(0, user.savingsProgress);
  user.balance = Math.max(0, user.balance);

  // Persist the clamped values
  await user.save();

  return user;
};
