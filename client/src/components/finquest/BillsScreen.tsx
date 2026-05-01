import { Lock, ToggleLeft, ToggleRight, CalendarClock } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { EXPENSES } from "@/lib/expenses";
import { cn } from "@/lib/utils";

// ── Component ─────────────────────────────────────────────────────────────────

export function BillsScreen() {
  const { user, salary, optionalOff, lockedOptional, toggleOptional } = useFinQuest();

  if (!user) return null;

  const expenses       = EXPENSES[user.persona];
  const mandatory      = expenses.filter(e => e.mandatory);
  const optional       = expenses.filter(e => !e.mandatory);
  const mandatoryTotal = mandatory.reduce((s, e) => s + e.amount, 0);
  const optionalTotal  = optional.filter(e => !optionalOff.has(e.id)).reduce((s, e) => s + e.amount, 0);
  const grandTotal     = mandatoryTotal + optionalTotal;
  const remaining      = salary - grandTotal;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monthly Bills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mandatory bills are always deducted. Toggle optional subscriptions on or off.
          </p>
        </div>

        {/* Summary bar */}
        <div className="rounded-2xl border border-border bg-card shadow-card-soft p-5 flex items-center gap-6">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Going Out</div>
            <div className="text-3xl font-bold">${grandTotal.toFixed(2)}</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Monthly Salary</div>
            <div className="text-2xl font-semibold text-emerald-600">+${salary.toLocaleString()}</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Left After Bills</div>
            <div className={cn("text-2xl font-bold tabular-nums", remaining >= 0 ? "text-foreground" : "text-destructive")}>
              {remaining < 0 ? "-" : ""}${Math.abs(remaining).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mandatory <span className="font-medium text-foreground">${mandatoryTotal.toFixed(2)}</span></span>
            <span>Optional <span className="font-medium text-foreground">${optionalTotal.toFixed(2)}</span></span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden flex gap-0.5">
            <div
              className="h-full bg-blue-500 rounded-l-full transition-all duration-300"
              style={{ width: `${(mandatoryTotal / salary) * 100}%` }}
            />
            <div
              className="h-full bg-violet-500 rounded-r-full transition-all duration-300"
              style={{ width: `${(optionalTotal / salary) * 100}%` }}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> Mandatory
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-violet-500" /> Optional (active)
            </div>
          </div>
        </div>

        {/* Mandatory bills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mandatory</h2>
            <span className="text-xs text-muted-foreground font-medium">${mandatoryTotal.toFixed(2)} / mo</span>
          </div>
          {mandatory.map(expense => {
            const Icon = expense.icon;
            return (
              <div key={expense.id} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-card-soft">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{expense.label}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Lock className="w-3 h-3" /> Auto-deducted every month
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums">${expense.amount.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Optional bills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Optional</h2>
            <span className="text-xs text-muted-foreground font-medium">${optionalTotal.toFixed(2)} active / mo</span>
          </div>
          {optional.map(expense => {
            const Icon   = expense.icon;
            const isOn   = !optionalOff.has(expense.id);
            const locked = lockedOptional.has(expense.id);
            return (
              <button
                key={expense.id}
                onClick={() => toggleOptional(expense.id)}
                disabled={locked}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left",
                  locked
                    ? "bg-card border-amber-200 dark:border-amber-800 cursor-not-allowed"
                    : isOn
                    ? "bg-card border-border/60 shadow-card-soft hover:border-primary/40"
                    : "bg-muted/30 border-border/30 opacity-60 hover:opacity-80"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200",
                  locked ? "bg-amber-50 dark:bg-amber-950/30" : isOn ? "bg-violet-50 dark:bg-violet-950/30" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    locked ? "text-amber-600 dark:text-amber-400" : isOn ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{expense.label}</div>
                  <div className={cn("text-xs mt-0.5 flex items-center gap-1", locked ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
                    {locked
                      ? <><CalendarClock className="w-3 h-3" /> Locked until next month</>
                      : isOn ? "Active · will be deducted" : "Cancelled · not deducted"
                    }
                  </div>
                </div>
                <span className={cn("text-sm font-bold tabular-nums mr-1", !isOn && !locked && "text-muted-foreground line-through")}>
                  ${expense.amount.toFixed(2)}
                </span>
                {locked
                  ? <Lock className="w-5 h-5 text-amber-500 shrink-0" />
                  : isOn
                  ? <ToggleRight className="w-6 h-6 text-primary shrink-0" />
                  : <ToggleLeft  className="w-6 h-6 text-muted-foreground shrink-0" />
                }
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
