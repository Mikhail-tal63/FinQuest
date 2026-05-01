import { useEffect, useState } from "react";
import { Trophy, Shield, Eye, TrendingDown, TrendingUp, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { api, FinalReport as Report } from "@/lib/api";
import { useFinQuest } from "@/context/FinQuestContext";
import { EXPENSES } from "@/lib/expenses";
import { cn } from "@/lib/utils";

export function FinalReport() {
  const { sessionId, user, salary, transactions, optionalOff, selectPersona } = useFinQuest();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (sessionId) api.getResult(sessionId).then(setReport);
  }, [sessionId]);

  const expenses     = user ? EXPENSES[user.persona] : [];
  const mandatory    = expenses.filter(e => e.mandatory);
  const optional     = expenses.filter(e => !e.mandatory && !optionalOff.has(e.id));
  const mandatoryAmt = mandatory.reduce((s, e) => s + e.amount, 0);
  const optionalAmt  = optional.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = mandatoryAmt + optionalAmt;
  const scenarioNet   = transactions.reduce((s, t) => s + t.amount, 0);
  const finalBalance  = salary - totalExpenses + scenarioNet;
  const survived      = finalBalance >= 0;

  if (!report) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">Loading report…</div>;
  }

  return (
    <div className="min-h-full overflow-auto">
      <div className="max-w-3xl mx-auto p-8 space-y-6">

        {/* ── Hero ── */}
        <div className="text-center">
          <div className={cn(
            "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white shadow-icon",
            survived ? "dock-green" : "dock-orange"
          )}>
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="mt-5 text-4xl font-bold">Month Complete</h1>
          <p className="mt-2 text-muted-foreground">Here's how your April played out.</p>
        </div>

        {/* ── Verdict banner ── */}
        <div className={cn(
          "rounded-2xl px-6 py-5 flex items-center gap-4 border",
          survived
            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
        )}>
          {survived
            ? <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
            : <XCircle    className="w-8 h-8 text-red-600 shrink-0" />
          }
          <div>
            <div className={cn("text-lg font-bold", survived ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
              {survived ? "You survived the month!" : "You ended the month in debt."}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {survived
                ? "Great work managing your finances under pressure."
                : "Review your spending decisions below to see where things went wrong."}
            </div>
          </div>
          <div className="ml-auto text-right shrink-0">
            <div className={cn("text-2xl font-bold tabular-nums", survived ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
              {finalBalance < 0 ? "-" : "+"}${Math.abs(finalBalance).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">net balance</div>
          </div>
        </div>

        {/* ── Financial breakdown ── */}
        <div className="rounded-2xl border border-border bg-card shadow-card-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-border/60">
            <h2 className="font-semibold">Monthly Breakdown</h2>
          </div>

          <div className="divide-y divide-border/40">
            {/* Salary */}
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Monthly Salary</span>
              </div>
              <span className="text-sm font-bold text-green-600">+${salary.toLocaleString()}</span>
            </div>

            {/* Mandatory expenses */}
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Mandatory Expenses</span>
                </div>
                <span className="text-sm font-bold text-blue-600">-${mandatoryAmt.toFixed(2)}</span>
              </div>
              <div className="mt-2 ml-7 space-y-1">
                {mandatory.map(e => (
                  <div key={e.id} className="flex justify-between text-xs text-muted-foreground">
                    <span>{e.label}</span>
                    <span>${e.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional expenses */}
            {optional.length > 0 && (
              <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-medium">Optional Expenses</span>
                  </div>
                  <span className="text-sm font-bold text-violet-600">-${optionalAmt.toFixed(2)}</span>
                </div>
                <div className="mt-2 ml-7 space-y-1">
                  {optional.map(e => (
                    <div key={e.id} className="flex justify-between text-xs text-muted-foreground">
                      <span>{e.label}</span>
                      <span>${e.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scenario effects */}
            {transactions.length > 0 && (
              <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {scenarioNet >= 0
                      ? <TrendingUp className="w-4 h-4 text-green-500" />
                      : <TrendingDown className="w-4 h-4 text-destructive" />
                    }
                    <span className="text-sm font-medium">Scenario Effects</span>
                  </div>
                  <span className={cn("text-sm font-bold", scenarioNet >= 0 ? "text-green-600" : "text-destructive")}>
                    {scenarioNet >= 0 ? "+" : ""}{scenarioNet.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 ml-7 space-y-1">
                  {transactions.filter(t => t.amount !== 0).map(t => (
                    <div key={t.id} className="flex justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[200px]">{t.label}</span>
                      <span className={t.amount < 0 ? "text-destructive" : "text-green-600"}>
                        {t.amount >= 0 ? "+" : ""}${t.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Net */}
            <div className="px-6 py-4 bg-muted/30 flex items-center justify-between">
              <span className="font-semibold">End-of-Month Balance</span>
              <span className={cn("text-lg font-bold tabular-nums", finalBalance >= 0 ? "text-green-600" : "text-destructive")}>
                {finalBalance < 0 ? "-" : ""}${Math.abs(finalBalance).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ── XP + Scores ── */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] text-primary-foreground shadow-window text-center">
          <div className="text-sm uppercase tracking-wider opacity-80">Total XP Earned</div>
          <div className="mt-1 text-5xl font-bold">{report.totalXp.toLocaleString()}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card-soft">
            <Shield className="w-5 h-5 text-primary" />
            <div className="mt-3 text-2xl font-bold">{report.finalScores.security}<span className="text-sm font-normal text-muted-foreground">/100</span></div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Security Score</div>
          </div>
          <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card-soft">
            <Eye className="w-5 h-5 text-primary" />
            <div className="mt-3 text-2xl font-bold">{report.finalScores.awareness}<span className="text-sm font-normal text-muted-foreground">/100</span></div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Awareness Score</div>
          </div>
        </div>

        {/* ── Attempts ── */}
        {report.attempts.length > 0 && (
          <div className="rounded-2xl bg-card border border-border/50 shadow-card-soft p-6">
            <h3 className="font-semibold mb-4">Scenario Outcomes</h3>
            <div className="space-y-2">
              {report.attempts.map((a, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                  <span className="text-sm">{a.scenario}</span>
                  <span className={cn(
                    "text-xs font-semibold uppercase px-2 py-1 rounded-full",
                    a.result === "correct"   ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                    a.result === "incorrect" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                                              "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  )}>{a.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Play again ── */}
        <div className="flex flex-col items-center gap-3 pb-4">
          <p className="text-sm text-muted-foreground">Want to try a different persona?</p>
          <button
            onClick={() => user && selectPersona(user.persona)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition-smooth text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again ({user?.persona})
          </button>
          <button
            onClick={() => selectPersona("student")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth text-sm font-medium"
          >
            Choose New Persona
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
