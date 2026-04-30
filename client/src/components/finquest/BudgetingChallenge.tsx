import { useState } from "react";
import { PiggyBank, Plus, Trash2, CheckCircle2, AlertCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryKey = "needs" | "wants" | "savings";

interface LineItem {
  id: string;
  label: string;
  amount: string;
}

type BudgetItems = Record<CategoryKey, LineItem[]>;

interface EvalResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  unallocated: number;
  messages: { text: string; positive: boolean }[];
  verdict: string;
}

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  description: string;
  target: number;
  color: string;
  border: string;
  bg: string;
  bar: string;
  placeholders: string[];
}[] = [
  {
    key: "needs",
    label: "Needs",
    description: "Essential expenses",
    target: 50,
    color: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    bar: "bg-blue-500",
    placeholders: ["Rent", "Utilities", "Groceries", "Insurance", "Transport"],
  },
  {
    key: "wants",
    label: "Wants",
    description: "Lifestyle spending",
    target: 30,
    color: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    bar: "bg-purple-500",
    placeholders: ["Dining Out", "Entertainment", "Shopping", "Subscriptions"],
  },
  {
    key: "savings",
    label: "Savings",
    description: "Save & invest",
    target: 20,
    color: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    bg: "bg-green-50 dark:bg-green-950/30",
    bar: "bg-green-500",
    placeholders: ["Emergency Fund", "Investments", "Vacation", "Goals"],
  },
];

const GRADE_COLOR: Record<string, string> = {
  A: "text-green-600",
  B: "text-blue-600",
  C: "text-yellow-600",
  D: "text-orange-600",
  F: "text-red-600",
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function makeItem(): LineItem {
  return { id: uid(), label: "", amount: "" };
}

function sumItems(items: LineItem[]): number {
  return items.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0);
}

function evaluate(income: number, needs: number, wants: number, savings: number): EvalResult {
  const unallocated = income - needs - wants - savings;
  const needsPct = (needs / income) * 100;
  const wantsPct = (wants / income) * 100;
  const savingsPct = (savings / income) * 100;

  const messages: { text: string; positive: boolean }[] = [];

  // Savings feedback
  if (savingsPct === 0) {
    messages.push({ text: "You saved nothing — any unexpected expense will push you into debt.", positive: false });
  } else if (savingsPct < 10) {
    messages.push({ text: `Savings at ${savingsPct.toFixed(0)}% — try to reach at least 20% for real financial security.`, positive: false });
  } else if (savingsPct >= 20) {
    messages.push({ text: `Savings at ${savingsPct.toFixed(0)}% — you hit the recommended 20% target. Excellent!`, positive: true });
  } else {
    messages.push({ text: `Savings at ${savingsPct.toFixed(0)}% — close to the 20% target, keep pushing.`, positive: true });
  }

  // Needs feedback
  if (needsPct > 65) {
    messages.push({ text: `Needs at ${needsPct.toFixed(0)}% — well above the 50% guideline. Look for ways to reduce fixed costs like rent or recurring bills.`, positive: false });
  } else if (needsPct < 25 && needs > 0) {
    messages.push({ text: `Needs at ${needsPct.toFixed(0)}% — make sure all essential expenses are actually covered.`, positive: false });
  } else {
    messages.push({ text: `Needs at ${needsPct.toFixed(0)}% — within a healthy range (target: 50%).`, positive: needsPct <= 55 });
  }

  // Wants feedback
  if (wantsPct > 45) {
    messages.push({ text: `Lifestyle/wants at ${wantsPct.toFixed(0)}% — significantly over the 30% target. Review discretionary spending.`, positive: false });
  } else if (wantsPct > 30) {
    messages.push({ text: `Wants at ${wantsPct.toFixed(0)}% — slightly over the 30% guideline.`, positive: false });
  } else {
    messages.push({ text: `Wants at ${wantsPct.toFixed(0)}% — within the 30% target. Good discipline!`, positive: true });
  }

  // Unallocated feedback
  if (unallocated > income * 0.05) {
    messages.push({ text: `$${unallocated.toFixed(0)} is sitting unallocated — give it a job (savings, a goal, or debt repayment).`, positive: false });
  } else if (unallocated >= 0) {
    messages.push({ text: "Every dollar is allocated — no idle money.", positive: true });
  }

  // Score
  let score = 100;
  score -= Math.abs(needsPct - 50) * 1.2;
  score -= Math.abs(wantsPct - 30) * 1.2;
  score -= Math.abs(savingsPct - 20) * 2;
  if (unallocated > income * 0.05) score -= 8;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const grade: EvalResult["grade"] =
    score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";

  const verdict =
    grade === "A" ? "Excellent! Your budget closely follows the 50/30/20 rule." :
    grade === "B" ? "Good budget — small tweaks will push you to excellent." :
    grade === "C" ? "Decent start, but there's meaningful room to improve." :
    grade === "D" ? "Your budget needs significant adjustments to be sustainable." :
    "This allocation puts your long-term financial health at serious risk.";

  return { score, grade, needsPct, wantsPct, savingsPct, unallocated, messages, verdict };
}

export function BudgetingChallenge() {
  const [income, setIncome] = useState("");
  const [items, setItems] = useState<BudgetItems>({
    needs: [makeItem()],
    wants: [makeItem()],
    savings: [makeItem()],
  });
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);

  const incomeVal = parseFloat(income) || 0;
  const needsTotal = sumItems(items.needs);
  const wantsTotal = sumItems(items.wants);
  const savingsTotal = sumItems(items.savings);
  const allocatedTotal = needsTotal + wantsTotal + savingsTotal;
  const remaining = incomeVal - allocatedTotal;
  const overBudget = allocatedTotal > incomeVal && incomeVal > 0;

  const addItem = (cat: CategoryKey) =>
    setItems(prev => ({ ...prev, [cat]: [...prev[cat], makeItem()] }));

  const updateItem = (cat: CategoryKey, id: string, field: "label" | "amount", value: string) =>
    setItems(prev => ({
      ...prev,
      [cat]: prev[cat].map(i => (i.id === id ? { ...i, [field]: value } : i)),
    }));

  const removeItem = (cat: CategoryKey, id: string) =>
    setItems(prev => ({ ...prev, [cat]: prev[cat].filter(i => i.id !== id) }));

  const reset = () => {
    setIncome("");
    setItems({ needs: [makeItem()], wants: [makeItem()], savings: [makeItem()] });
    setEvalResult(null);
  };

  const canEvaluate = incomeVal > 0 && allocatedTotal > 0 && !overBudget;

  return (
    <div className="mt-8 rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PiggyBank className="w-6 h-6 text-orange-500" />
          <div>
            <h2 className="text-lg font-bold">Income Budgeting</h2>
            <p className="text-xs text-muted-foreground">
              Enter your salary, add what you spend on, and we'll evaluate your budget.
            </p>
          </div>
        </div>
        {(evalResult || allocatedTotal > 0 || income) && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {!evalResult ? (
        <>
          {/* Income */}
          <div className="mb-6">
            <label className="text-sm font-semibold block mb-1.5">Monthly Income / Salary</label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">$</span>
              <input
                type="number"
                min={0}
                value={income}
                onChange={e => setIncome(e.target.value)}
                placeholder="e.g. 3000"
                className="w-full pl-7 pr-4 h-11 rounded-xl border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Category sections */}
          <div className="space-y-4">
            {CATEGORIES.map((cat, catIdx) => {
              const total = sumItems(items[cat.key]);
              const pct = incomeVal > 0 ? (total / incomeVal) * 100 : 0;

              return (
                <div key={cat.key} className={cn("rounded-xl border p-4", cat.border, cat.bg)}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className={cn("font-semibold text-sm", cat.color)}>{cat.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        — {cat.description} · target {cat.target}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">${total.toLocaleString()}</span>
                      {incomeVal > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">({pct.toFixed(0)}%)</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {items[cat.key].map((item, itemIdx) => (
                      <div key={item.id} className="flex gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => updateItem(cat.key, item.id, "label", e.target.value)}
                          placeholder={cat.placeholders[(catIdx + itemIdx) % cat.placeholders.length]}
                          className="flex-1 h-9 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                          <input
                            type="number"
                            min={0}
                            value={item.amount}
                            onChange={e => updateItem(cat.key, item.id, "amount", e.target.value)}
                            placeholder="0"
                            className="w-24 pl-5 pr-2 h-9 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                        <button
                          onClick={() => removeItem(cat.key, item.id)}
                          disabled={items[cat.key].length === 1}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth disabled:opacity-25"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addItem(cat.key)}
                    className={cn("mt-2 flex items-center gap-1.5 text-xs font-medium transition-smooth hover:opacity-70", cat.color)}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add item
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary bar */}
          {incomeVal > 0 && (
            <div className="mt-5 rounded-xl bg-card border border-border/50 p-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Allocated: ${allocatedTotal.toLocaleString()}</span>
                <span className={overBudget ? "text-destructive font-semibold" : ""}>
                  {overBudget
                    ? `Over budget by $${Math.abs(remaining).toFixed(0)}`
                    : `Remaining: $${remaining.toFixed(0)}`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                {CATEGORIES.map(cat => {
                  const pct = Math.min(100, (sumItems(items[cat.key]) / incomeVal) * 100);
                  return (
                    <div
                      key={cat.key}
                      className={cat.bar}
                      style={{ width: `${pct}%`, transition: "width 0.3s ease" }}
                    />
                  );
                })}
              </div>
              <div className="flex gap-4 mt-2">
                {CATEGORIES.map(cat => (
                  <div key={cat.key} className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", cat.bar)} />
                    <span className="text-xs text-muted-foreground">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            disabled={!canEvaluate}
            onClick={() => setEvalResult(evaluate(incomeVal, needsTotal, wantsTotal, savingsTotal))}
            className="mt-5 w-full h-11 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Evaluate My Budget
          </button>
          {overBudget && (
            <p className="text-xs text-destructive mt-2 text-center">
              Your expenses exceed your income — adjust the amounts first.
            </p>
          )}
        </>
      ) : (
        /* Results */
        <div className="space-y-5">
          {/* Grade card */}
          <div className="flex items-center gap-5 p-5 rounded-xl bg-card border border-border/50">
            <div className={cn("text-6xl font-black leading-none", GRADE_COLOR[evalResult.grade])}>
              {evalResult.grade}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{evalResult.verdict}</div>
              <div className="text-sm text-muted-foreground mt-1">Budget Score: {evalResult.score}/100</div>
              <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-orange-400 transition-all duration-700"
                  style={{ width: `${evalResult.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Percentage breakdown */}
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(cat => {
              const pct =
                cat.key === "needs"
                  ? evalResult.needsPct
                  : cat.key === "wants"
                  ? evalResult.wantsPct
                  : evalResult.savingsPct;
              const diff = pct - cat.target;
              return (
                <div key={cat.key} className={cn("rounded-xl border p-3 text-center", cat.border, cat.bg)}>
                  <div className={cn("text-xs font-semibold uppercase tracking-wide mb-1", cat.color)}>
                    {cat.label}
                  </div>
                  <div className="text-2xl font-bold">{pct.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">target {cat.target}%</div>
                  <div
                    className={cn(
                      "text-xs font-medium mt-1",
                      Math.abs(diff) <= 5 ? "text-green-600" : diff > 0 ? "text-destructive" : "text-orange-500"
                    )}
                  >
                    {diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback messages */}
          <div className="space-y-2">
            {evalResult.messages.map((m, i) => {
              const Icon = m.positive ? CheckCircle2 : i === 0 && !m.positive ? XCircle : AlertCircle;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 p-3 rounded-xl text-sm",
                    m.positive ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"
                  )}
                >
                  <Icon
                    className={cn("w-4 h-4 shrink-0 mt-0.5", m.positive ? "text-green-600" : "text-red-500")}
                  />
                  <span>{m.text}</span>
                </div>
              );
            })}
          </div>

          {/* 50/30/20 tip */}
          <div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">The 50/30/20 Rule: </span>
            50% of your income goes to needs (rent, bills, food), 30% to wants (lifestyle, entertainment), and 20% to savings. This simple framework builds financial security over time without sacrificing quality of life.
          </div>

          <button
            onClick={reset}
            className="w-full h-11 rounded-xl border border-border font-medium hover:bg-muted/50 transition-smooth flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Try a Different Budget
          </button>
        </div>
      )}
    </div>
  );
}
