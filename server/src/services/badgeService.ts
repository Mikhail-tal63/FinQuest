import { IUser } from '../models/User';
import { Badge, UserBadge } from '../models/Badge';

export const checkAndAwardBadges = async (user: IUser): Promise<unknown[]> => {
  const allBadges = await Badge.find();
  const existing = await UserBadge.find({ userId: user._id }).select('badgeId');
  const earnedIds = new Set(existing.map((ub) => String(ub.badgeId)));
  const newlyAwarded: unknown[] = [];

  for (const badge of allBadges) {
    if (earnedIds.has(String(badge._id))) continue;
    let qualifies = false;
    switch (badge.conditionType) {
      case 'awareness':        qualifies = user.awarenessScore >= badge.requiredScore; break;
      case 'security':         qualifies = user.securityScore >= badge.requiredScore; break;
      case 'savings':          qualifies = user.savingsProgress >= badge.requiredScore; break;
      case 'scenarios_completed': qualifies = user.completedScenarios.length >= badge.requiredScore; break;
      case 'balance':          qualifies = user.balance >= badge.requiredScore; break;
      case 'xp':               qualifies = user.xp >= badge.requiredScore; break;
      case 'risk_low':         qualifies = user.riskLevel <= badge.requiredScore; break;
    }
    if (qualifies) {
      await UserBadge.create({ userId: user._id, badgeId: badge._id });
      newlyAwarded.push(badge);
    }
  }
  return newlyAwarded;
};
