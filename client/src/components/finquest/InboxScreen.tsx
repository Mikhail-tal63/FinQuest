import { useState, useEffect } from "react";
import { Mail, Inbox as InboxIcon, ShieldAlert, CheckCheck, ExternalLink, Clock, Banknote } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { AnswerResult, Scenario } from "@/lib/api";
import { ResultModal } from "./ResultModal";
import { PhishingFormModal } from "./PhishingFormModal";
import { cn } from "@/lib/utils";

const LINK_LABELS: Record<string, string> = {
  phishing_bank:        "Verify My Account Now →",
  phishing_grant:       "Claim My $3,500 Grant →",
  salary_update:        "Update Payroll Details →",
  investment_scam:      "Join the Investment Platform →",
  tax_refund:           "Claim My Refund →",
  account_verification: "Re-verify My Account →",
  prize_notification:   "Complete Survey & Claim Prize →",
};

const SALARY_ID   = "__salary_deposit__";
const SALARY_ID_2 = "__salary_deposit_2__";

export function InboxScreen() {
  const { allScenarios, answeredIds, gameDay, answerScenario, salary, user } = useFinQuest();

  const [selectedId, setSelectedId] = useState<string>(SALARY_ID);
  const [result, setResult]         = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen]     = useState(false);

  // All inbox scenarios revealed so far
  const inboxScenarios = allScenarios
    .filter(s => s.source === "inbox" && s.scheduledDay <= gameDay)
    .sort((a, b) => a.scheduledDay - b.scheduledDay);

  // First unanswered revealed scenario
  const activeScenario: Scenario | null =
    inboxScenarios.find(s => !answeredIds.has(s.id)) ?? null;

  // Auto-select the active scenario when it first appears; otherwise keep salary email selected
  useEffect(() => {
    if (activeScenario) setSelectedId(activeScenario.id);
  }, [activeScenario?.id]);

  const viewedScenario  = inboxScenarios.find(s => s.id === selectedId) ?? null;
  const viewingSalary   = selectedId === SALARY_ID;
  const viewingSalary2  = selectedId === SALARY_ID_2;

  const handleAnswer = async (choiceIndex: number) => {
    if (!viewedScenario || submitting) return;
    setSubmitting(true);
    setFormOpen(false);
    try {
      const r = await answerScenario(viewedScenario.id, choiceIndex);
      setResult(r);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = () => {
    const worst = viewedScenario?.choices.find(c => c.qualityLevel === "worst");
    if (worst !== undefined) handleAnswer(worst.index);
  };

  const handleReport = () => {
    const best = viewedScenario?.choices.find(c => c.qualityLevel === "best");
    if (best !== undefined) handleAnswer(best.index);
  };

  const isCurrentViewed = viewedScenario?.id === activeScenario?.id;
  const isAnswered      = viewedScenario ? answeredIds.has(viewedScenario.id) : false;
  const linkLabel       = viewedScenario ? LINK_LABELS[viewedScenario.type] : null;

  return (
    <div className="h-full flex">
      {/* ── List pane ────────────────────────────────────────────────────── */}
      <aside className="w-80 border-r border-border/50 flex flex-col bg-card">
        <div className="p-5 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold">Inbox</h2>
          <div className="flex bg-muted rounded-full p-0.5 text-xs font-medium">
            <button className="px-3 py-1 rounded-full bg-card shadow-sm">All mail</button>
            <button className="px-3 py-1 text-muted-foreground">Unread</button>
          </div>
        </div>

        <div className="px-3 space-y-1 overflow-auto flex-1">
          {/* Month 1 salary — always shown */}
          <button
            onClick={() => setSelectedId(SALARY_ID)}
            className={cn(
              "w-full text-left p-3 rounded-xl transition-smooth border",
              viewingSalary ? "bg-card border-border shadow-sm" : "border-transparent hover:bg-muted/50"
            )}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm font-normal text-muted-foreground truncate">FinQuest Payroll</span>
              <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> Day 1
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              April Salary — ${salary.toLocaleString()}
            </div>
          </button>

          {/* Month 2 salary — appears on day 31 */}
          {gameDay >= 31 && (
            <button
              onClick={() => setSelectedId(SALARY_ID_2)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-smooth border",
                viewingSalary2 ? "bg-card border-border shadow-sm" : "border-transparent hover:bg-muted/50"
              )}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-normal text-muted-foreground truncate">FinQuest Payroll</span>
                <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> Day 31
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                May Salary — ${salary.toLocaleString()}
              </div>
            </button>
          )}

          {/* Scenario emails */}
          {inboxScenarios.map(scenario => {
            const isSelected = selectedId === scenario.id;
            const isRead     = answeredIds.has(scenario.id);
            const isActive   = scenario.id === activeScenario?.id;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedId(scenario.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-smooth border",
                  isSelected ? "bg-card border-border shadow-sm" : "border-transparent hover:bg-muted/50"
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className={cn("text-sm truncate", isRead ? "font-normal text-muted-foreground" : "font-semibold")}>
                    {scenario.sender}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Day {scenario.scheduledDay}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">{scenario.subject}</div>
                {isActive && !isRead && (
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary inline-block" />
                )}
              </button>
            );
          })}

        </div>
      </aside>

      {/* ── Message view ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 shrink-0 min-h-[48px]">
          {!viewingSalary && !viewingSalary2 && isCurrentViewed && !isAnswered ? (
            <>
              <button
                onClick={handleReport}
                disabled={submitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive/10 transition-smooth disabled:opacity-50"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Report as Phishing
              </button>
              <button
                onClick={handleReport}
                disabled={submitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-muted-foreground text-xs font-medium hover:bg-muted transition-smooth disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Ignore Email
              </button>
            </>
          ) : !viewingSalary && !viewingSalary2 && isAnswered ? (
            <span className="text-xs text-muted-foreground italic flex items-center gap-1.5">
              <CheckCheck className="w-3.5 h-3.5 text-green-500" />
              Handled
            </span>
          ) : null}
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {viewingSalary ? (
            /* ── Month 1 salary email ── */
            <>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">FinQuest Payroll</h3>
                    <span className="text-xs text-muted-foreground">Day 1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">April Salary — ${salary.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-6 text-sm leading-relaxed text-foreground max-w-2xl space-y-4">
                <p>Hi <span className="font-medium capitalize">{user?.persona}</span>,</p>
                <p>
                  Your monthly salary of{" "}
                  <span className="font-semibold text-emerald-600">${salary.toLocaleString()}</span> has been
                  deposited for April 2026.
                </p>
                <p>
                  Your recurring bills and active subscriptions will be deducted from this amount. Use the{" "}
                  <span className="font-medium">Bills</span> screen to manage your expenses — you can cancel
                  optional subscriptions at any time.
                </p>
                <p>Stay alert for suspicious emails. Any financial loss from scams comes directly out of your balance.</p>
                <p className="text-muted-foreground">Good luck — your goal is to finish two months without going into debt.</p>
              </div>
              <div className="mt-8 max-w-2xl rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4 flex items-center gap-4">
                <Banknote className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wide">April Deposit</div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">+${salary.toLocaleString()}</div>
                </div>
              </div>
            </>
          ) : viewingSalary2 ? (
            /* ── Month 2 salary email ── */
            <>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">FinQuest Payroll</h3>
                    <span className="text-xs text-muted-foreground">Day 31</span>
                  </div>
                  <p className="text-sm text-muted-foreground">May Salary — ${salary.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-6 text-sm leading-relaxed text-foreground max-w-2xl space-y-4">
                <p>Hi <span className="font-medium capitalize">{user?.persona}</span>,</p>
                <p>
                  Your May salary of{" "}
                  <span className="font-semibold text-emerald-600">${salary.toLocaleString()}</span> has been
                  deposited. You are now in month two of your financial simulation.
                </p>
                <p>
                  Your bills have reset for this month — all active subscriptions will be deducted again. Scammers
                  are still out there, so stay sharp.
                </p>
                <p className="text-muted-foreground">One month down. Finish strong.</p>
              </div>
              <div className="mt-8 max-w-2xl rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4 flex items-center gap-4">
                <Banknote className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wide">May Deposit</div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">+${salary.toLocaleString()}</div>
                </div>
              </div>
            </>
          ) : viewedScenario ? (
            /* ── Normal scenario email ── */
            <>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{viewedScenario.sender}</h3>
                    <span className="text-xs text-muted-foreground">Day {viewedScenario.scheduledDay}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{viewedScenario.subject}</p>
                </div>
              </div>

              <div className="mt-6 text-sm leading-relaxed text-foreground max-w-2xl">
                {viewedScenario.description}
              </div>

              {/* Phishing link — active and unanswered */}
              {linkLabel && !isAnswered && (
                <div className="mt-6 max-w-2xl">
                  <button
                    onClick={() => isCurrentViewed && setFormOpen(true)}
                    disabled={!isCurrentViewed || submitting}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-2 transition-colors",
                      isCurrentViewed
                        ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                        : "text-blue-400 cursor-default no-underline"
                    )}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {linkLabel}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Select an email to read it.
            </div>
          )}
        </div>
      </div>

      {formOpen && viewedScenario && user && (
        <PhishingFormModal
          scenarioType={viewedScenario.type}
          persona={user.persona}
          onSubmit={handleFormSubmit}
          onClose={() => setFormOpen(false)}
        />
      )}

      {result && <ResultModal result={result} onContinue={() => setResult(null)} />}
    </div>
  );
}
