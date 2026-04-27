import User from '../models/User';
import Attempt from '../models/Attempt';
import { UserBadge, Badge } from '../models/Badge';
import Transaction from '../models/Transaction';

/**
 * reportService
 *
 * Aggregates all session data for a user into a single report object
 * used by the Final Report page.
 */
export const generateReport = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // All attempts (for strength / weakness analysis)
  const attempts = await Attempt.find({ userId }).populate('scenarioId', 'title category');

  // Earned badges
  const userBadges = await UserBadge.find({ userId }).populate('badgeId');
  const badges = userBadges.map((ub) => ub.badgeId);

  // Recent transactions
  const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);

  // Accuracy stats
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  // Derive strengths and weaknesses from category performance
  const categoryMap: Record<string, { correct: number; total: number }> = {};
  for (const attempt of attempts) {
    const scenario = attempt.scenarioId as { category?: string } | null;
    const cat = scenario?.category ?? 'General';
    if (!categoryMap[cat]) categoryMap[cat] = { correct: 0, total: 0 };
    categoryMap[cat].total += 1;
    if (attempt.isCorrect) categoryMap[cat].correct += 1;
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  for (const [cat, stats] of Object.entries(categoryMap)) {
    const rate = stats.correct / stats.total;
    if (rate >= 0.7) strengths.push(cat);
    else weaknesses.push(cat);
  }

  // Generate a simple personalised tip
  const tip = generateTip(user.awarenessScore, user.securityScore, weaknesses);

  return {
    user: {
      name: user.name,
      role: user.role,
      finalBalance: user.balance,
      awarenessScore: user.awarenessScore,
      securityScore: user.securityScore,
      savingsProgress: user.savingsProgress,
    },
    stats: {
      totalAttempts,
      correctAttempts,
      accuracy,
    },
    strengths,
    weaknesses,
    badges,
    recentTransactions: transactions,
    personalizedTip: tip,
  };
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function generateTip(awareness: number, security: number, weaknesses: string[]): string {
  if (security < 50)
    return 'Focus on identifying suspicious messages. Always verify the sender before clicking links.';
  if (awareness < 50)
    return 'Work on building a monthly budget. Tracking your expenses is the first step to financial control.';
  if (weaknesses.length > 0)
    return `You can improve further in: ${weaknesses.join(', ')}. Review those scenarios again.`;
  return 'Great job! You demonstrated strong financial awareness. Keep building your savings habit.';
}
