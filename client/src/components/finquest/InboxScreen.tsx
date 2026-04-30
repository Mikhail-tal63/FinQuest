import { useState, useEffect } from "react";
import { Mail, Inbox as InboxIcon, ShieldAlert, CheckCheck, ExternalLink, MessageSquare, Receipt, Clock } from "lucide-react";
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

export function InboxScreen() {
  const { allScenarios, answeredIds, gameDay, answerScenario, setActiveWindow } = useFinQuest();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult]         = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen]     = useState(false);

  // All inbox-type scenarios revealed so far, sorted by scheduledDay
  const inboxScenarios = allScenarios
    .filter(s => (s.source === "inbox" || s.source === "wallet") && s.scheduledDay <= gameDay)
    .sort((a, b) => a.scheduledDay - b.scheduledDay);

  // First unanswered revealed inbox scenario
  const activeScenario: Scenario | null =
    inboxScenarios.find(s => !answeredIds.has(s.id)) ?? null;

  // Auto-select the active scenario when it changes
  useEffect(() => {
    if (activeScenario) setSelectedId(activeScenario.id);
  }, [activeScenario?.id]);

  const viewedScenario = inboxScenarios.find(s => s.id === selectedId) ?? activeScenario;

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
  const isInboxSource   = viewedScenario?.source === "inbox";
  const linkLabel       = viewedScenario ? LINK_LABELS[viewedScenario.type] : null;

  // ── Empty state ──────────────────────────────────────────────────────────

  if (inboxScenarios.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <InboxIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Inbox is empty</h2>
        <p className="mt-2 text-muted-foreground">No emails yet — check back as the month progresses.</p>
      </div>
    );
  }

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
          {inboxScenarios.map(scenario => {
            const isSelected  = selectedId === scenario.id;
            const isRead      = answeredIds.has(scenario.id);
            const isActive    = scenario.id === activeScenario?.id;
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

          {/* Unrevealed previews */}
          {allScenarios
            .filter(s => (s.source === "inbox" || s.source === "wallet") && s.scheduledDay > gameDay)
            .map(s => (
              <div key={s.id} className="p-3 rounded-xl border border-dashed border-border/40 opacity-40">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm text-muted-foreground">···</span>
                  <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Day {s.scheduledDay}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Arrives on Day {s.scheduledDay}</div>
              </div>
            ))}
        </div>
      </aside>

      {/* ── Message view ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 shrink-0">
          {isCurrentViewed && isInboxSource && !isAnswered ? (
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
          ) : null}
          {isAnswered && (
            <span className="text-xs text-muted-foreground italic flex items-center gap-1.5">
              <CheckCheck className="w-3.5 h-3.5 text-green-500" />
              Handled
            </span>
          )}
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {viewedScenario ? (
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

              {/* Phishing link — inbox source only, active and unanswered */}
              {isInboxSource && linkLabel && !isAnswered && (
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

              {/* Choice buttons — wallet-source scenarios (e.g. income_budgeting) */}
              {!isInboxSource && isCurrentViewed && !isAnswered && (
                <div className="mt-8 max-w-2xl">
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    How do you respond?
                  </h4>
                  <div className="space-y-2">
                    {viewedScenario.choices.map(c => (
                      <button
                        key={c.index}
                        disabled={submitting}
                        onClick={() => handleAnswer(c.index)}
                        className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-smooth disabled:opacity-50 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                            {String.fromCharCode(65 + c.index)}
                          </span>
                          <span className="text-sm">{c.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Redirect hints when a different screen is needed */}
              {viewedScenario.source === "sms" || viewedScenario.source === "notification" ? (
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>This message is in your </span>
                  <button onClick={() => setActiveWindow("notifications")} className="text-primary underline">Notifications</button>
                </div>
              ) : viewedScenario.source === "bills" ? (
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Receipt className="w-4 h-4" />
                  <span>This bill is in your </span>
                  <button onClick={() => setActiveWindow("bills")} className="text-primary underline">Bills</button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Select an email to read it.
            </div>
          )}
        </div>
      </div>

      {formOpen && viewedScenario && (
        <PhishingFormModal
          scenarioType={viewedScenario.type}
          onSubmit={handleFormSubmit}
          onClose={() => setFormOpen(false)}
        />
      )}

      {result && <ResultModal result={result} onContinue={() => setResult(null)} />}
    </div>
  );
}
