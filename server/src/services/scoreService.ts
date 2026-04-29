import { IUser } from '../models/User';

export const updateScores = async (user: IUser): Promise<IUser> => {
  user.awarenessScore = Math.min(100, Math.max(0, user.awarenessScore));
  user.securityScore = Math.min(100, Math.max(0, user.securityScore));
  user.savingsProgress = Math.max(0, user.savingsProgress);
  user.balance = Math.max(0, user.balance);
  user.riskLevel = Math.min(100, Math.max(0, user.riskLevel));
  user.xp = Math.max(0, user.xp);
  user.decisionQualityScore = Math.min(100, Math.max(0, user.decisionQualityScore));
  await user.save();
  return user;
};
