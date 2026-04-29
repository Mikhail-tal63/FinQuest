import Attempt from '../models/Attempt';
import { UserBadge, Badge } from '../models/Badge';
import Transaction from '../models/Transaction';
import User from '../models/User';

// ── Pattern sentences ────────────────────────────────────────────────────────
const patternSentences: Record<string, string> = {
  phishing: 'You tend to trust suspicious messages too quickly.',
  impulse_spending: 'You make emotional purchases without thinking twice.',
  bill_delay: 'You have a habit of delaying bill payments.',
  fraud: 'You are vulnerable to social engineering fraud attempts.',
  poor_budgeting: 'Your budgeting decisions need improvement.',
};

const strengthSentences: Record<string, string> = {
  phishing: 'You are good at detecting phishing and fake messages.',
  impulse_spending: 'You resist impulsive spending well.',
  bill_delay: 'You pay bills on time consistently.',
  fraud: 'You are cautious with transfer and payment requests.',
  poor_budgeting: 'You plan your budget effectively.',
};

export const generateReport = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const attempts = await Attempt.find({ userId }).populate('scenarioId', 'title category source');
  const userBadges = await UserBadge.find({ userId }).populate('badgeId');
  const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total = attempts.length;
  const bestCount = attempts.filter((a) => a.qualityLevel === 'best').length;
  const avgCount = attempts.filter((a) => a.qualityLevel === 'average').length;
  const worstCount = attempts.filter((a) => a.qualityLevel === 'worst').length;
  const reasonCorrectCount = attempts.filter((a) => a.reasonIsCorrect).length;
  const accuracy = total > 0 ? Math.round((bestCount / total) * 100) : 0;
  const reasonAccuracy = total > 0 ? Math.round((reasonCorrectCount / total) * 100) : 0;

  // ── Mistake memory — count by tag ─────────────────────────────────────────
  const tagCounts: Record<string, number> = {};
  for (const tag of user.mistakeTags) {
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
  }

  // Categories attempted vs succeeded (from scenario.category)
  const categoryStats: Record<string, { best: number; total: number }> = {};
  for (const a of attempts) {
    const s = a.scenarioId as { category?: string } | null;
    const cat = s?.category ?? 'General';
    if (!categoryStats[cat]) categoryStats[cat] = { best: 0, total: 0 };
    categoryStats[cat].total += 1;
    if (a.qualityLevel === 'best') categoryStats[cat].best += 1;
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  for (const [cat, stats] of Object.entries(categoryStats)) {
    if (stats.best / stats.total >= 0.6) strengths.push(cat);
    else weaknesses.push(cat);
  }

  // ── Pattern sentence ──────────────────────────────────────────────────────
  const topMistake = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const pattern = topMistake
    ? patternSentences[topMistake] ?? 'Keep improving your financial decision-making.'
    : strengths.length > 0
    ? 'You are performing well across most financial categories.'
    : 'You are still building your financial awareness.';

  const strengthPattern = strengths
    .map((s) => strengthSentences[s.toLowerCase().replace(/ /g, '_')] ?? s)
    .join(' ');

  // ── Personalized tip ──────────────────────────────────────────────────────
  const tip = buildTip(user.role, user.securityScore, user.awarenessScore, topMistake, weaknesses);

  return {
    user: {
      name: user.name,
      role: user.role,
      finalBalance: user.balance,
      awarenessScore: user.awarenessScore,
      securityScore: user.securityScore,
      savingsProgress: user.savingsProgress,
      riskLevel: user.riskLevel,
      xp: user.xp,
      decisionQualityScore: user.decisionQualityScore,
    },
    stats: {
      total,
      bestCount,
      avgCount,
      worstCount,
      accuracy,
      reasonAccuracy,
    },
    mistakeMemory: Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      count,
      insight: patternSentences[tag] ?? tag,
    })),
    strengths,
    weaknesses,
    pattern,
    strengthPattern,
    badges: userBadges.map((ub) => ub.badgeId),
    recentTransactions: transactions,
    personalizedTip: tip,
  };
};

// ── Tip builder ───────────────────────────────────────────────────────────────
function buildTip(
  role: string,
  security: number,
  awareness: number,
  topMistake?: string,
  weaknesses: string[] = []
): string {
  if (topMistake === 'phishing')
    return 'Always check the sender address and avoid clicking links in urgent emails. Official institutions never ask for card details via email.';
  if (topMistake === 'impulse_spending')
    return 'Before any unplanned purchase, wait 24 hours. Ask yourself: do I need this, or do I want this?';
  if (topMistake === 'fraud')
    return 'Always verify money transfer requests through a known contact. Never act under artificial urgency.';
  if (security < 50)
    return 'Your security score needs attention. Focus on verifying sources before sharing any information.';
  if (awareness < 50)
    return 'Start tracking your income and expenses monthly. A simple budget can transform your financial health.';
  if (role === 'student' && weaknesses.includes('Budgeting'))
    return 'As a student, the 50/30/20 rule works great: 50% needs, 30% wants, 20% savings.';
  if (role === 'employee' && weaknesses.includes('Bill Management'))
    return 'Set up automatic bill payments to avoid late fees and protect your credit history.';
  if (role === 'freelancer')
    return 'With irregular income, always keep 3 months of expenses as emergency savings before investing elsewhere.';
  return 'Great performance overall! Keep building your savings habit and stay alert to suspicious messages.';
}
