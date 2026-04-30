import { useState } from "react";
import { TrendingDown, Landmark, ShoppingCart, Coffee, Smartphone, PiggyBank } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { useEffect } from "react";
import { api, AnswerResult } from "@/lib/api";
import { ResultModal } from "./ResultModal";

const transactions = [
  { name: "Whole Foods Market", meta: "Today, 2:45 PM • Groceries", amount: -142.8, Icon: ShoppingCart },
  { name: "Blue Bottle Coffee", meta: "Yesterday, 8:30 AM • Dining", amount: -12.5, Icon: Coffee },
  { name: "Apple Store", meta: "Oct 24, 4:15 PM • Electronics", amount: -1299.0, Icon: Smartphone },
];

export function WalletScreen() {
  const { user, refreshUser, currentScenario, sessionId, loadCurrentScenario, setCurrentScenario, setActiveWindow, setRemainingScenarios } =
    useFinQuest();
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleAnswer = async (choiceIndex: number) => {
    if (!sessionId || submitting) return;
    setSubmitting(true);
    try {
      const r = await api.answer(sessionId, choiceIndex);
      setResult(r);
      setRemainingScenarios(r.remainingScenarios);
      await refreshUser();
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    setResult(null);
    const next = await loadCurrentScenario();
    if (!next) {
      setCurrentScenario(null);
      setActiveWindow("final");
    } else if (next.source !== "wallet") {
      setActiveWindow("inbox");
    }
  };

  if (!user) return null;
  const balance = user.balance;
  const credit = 25000 - balance;
  const hasChallenge = currentScenario?.source === "wallet";

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight">Wallet</h1>
      <p className="mt-2 text-muted-foreground">Manage your cards and view spending insights.</p>

      {/* Budget Challenge Banner */}
      {hasChallenge && (
        <div className="mt-6 rounded-2xl border border-orange-300 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800 p-6">
          <div className="flex items-center gap-3 mb-1">
            <PiggyBank className="w-6 h-6 text-orange-500" />
            <h2 className="text-lg font-bold text-orange-700 dark:text-orange-400">Budgeting Challenge</h2>
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-300 mb-1 font-medium">{currentScenario.subject}</p>
          <p className="text-sm text-foreground/80 leading-relaxed mb-6">{currentScenario.description}</p>

          <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
            How do you allocate your income?
          </h4>
          <div className="space-y-2">
            {currentScenario.choices.map((c) => (
              <button
                key={c.index}
                disabled={submitting}
                onClick={() => handleAnswer(c.index)}
                className="w-full text-left p-4 rounded-xl border border-orange-200 dark:border-orange-800 bg-white dark:bg-card hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-smooth disabled:opacity-50 group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs flex items-center justify-center font-semibold group-hover:bg-orange-400 group-hover:text-white transition-smooth">
                    {String.fromCharCode(65 + c.index)}
                  </span>
                  <span className="text-sm">{c.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visa card */}
        <div className="lg:row-span-2 rounded-2xl p-6 bg-gradient-to-br from-[hsl(222,47%,11%)] to-[hsl(222,47%,18%)] text-white shadow-card-soft min-h-[220px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-8 rounded-md bg-white/15 backdrop-blur" />
            <span className="font-bold tracking-wider italic">VISA</span>
          </div>
          <div>
            <div className="font-mono tracking-widest text-lg">•••• •••• •••• 4289</div>
            <div className="mt-4 flex justify-between text-xs uppercase opacity-70">
              <span>Cardholder Name</span>
              <span>Expires</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="capitalize">{user.persona} User</span>
              <span>12/26</span>
            </div>
          </div>
        </div>

        {/* Monthly spend */}
        <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5" /> Monthly Spend
          </div>
          <div className="mt-2 text-3xl font-bold">${(4289.5).toLocaleString()}</div>
          <div className="mt-1 text-xs text-destructive">↓ 12% vs last month</div>
        </div>

        {/* Available credit */}
        <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Landmark className="w-3.5 h-3.5" /> Available Credit
          </div>
          <div className="mt-2 text-3xl font-bold">${credit.toLocaleString()}</div>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${Math.min(100, (credit / 25000) * 100)}%` }} />
          </div>
        </div>

        {/* Virtual card */}
        <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full dock-blue flex items-center justify-center text-white text-xs font-bold">VC</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Virtual Card</div>
              <div className="text-xs text-muted-foreground">Active • Online only</div>
            </div>
          </div>
          <div className="font-mono text-sm tracking-wider text-muted-foreground">•••• 8821</div>
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <t.Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.meta}</div>
                </div>
                <div className="text-sm font-semibold">{t.amount < 0 ? "-" : ""}${Math.abs(t.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Balance", value: `$${user.balance.toLocaleString()}` },
          { label: "XP", value: user.xp.toLocaleString() },
          { label: "Security Score", value: `${user.securityScore}/100` },
          { label: "Awareness Score", value: `${user.awarenessScore}/100` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 bg-card border border-border/50 shadow-card-soft">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {result && <ResultModal result={result} onContinue={handleContinue} />}
    </div>
  );
}
