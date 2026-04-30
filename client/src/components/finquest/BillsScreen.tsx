import { useState } from "react";
import { Receipt, Wifi, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { api, AnswerResult } from "@/lib/api";
import { ResultModal } from "./ResultModal";
import { cn } from "@/lib/utils";

export function BillsScreen() {
  const {
    currentScenario,
    sessionId,
    loadCurrentScenario,
    refreshUser,
    setActiveWindow,
    setCurrentScenario,
    setRemainingScenarios,
  } = useFinQuest();

  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    } else if (next.source === "bills") {
      // stay on bills screen for next bill
    } else if (next.source === "sms" || next.source === "notification") {
      setActiveWindow("notifications");
    } else {
      setActiveWindow("inbox");
    }
  };

  if (!currentScenario || currentScenario.source !== "bills") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <Receipt className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">No Bills Due</h2>
        <p className="mt-2 text-muted-foreground">You have no outstanding bills right now.</p>
        <button
          onClick={() => setActiveWindow("inbox")}
          className="mt-6 h-10 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth"
        >
          Go to Inbox
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Receipt className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold">Bills</h1>
        </div>

        {/* Bill card */}
        <div className="rounded-2xl border border-border bg-card shadow-card-soft overflow-hidden mb-6">
          {/* Bill header */}
          <div className="px-6 py-5 border-b border-border/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Wifi className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base">{currentScenario.sender}</div>
              <div className="text-sm text-muted-foreground">{currentScenario.subject}</div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-800 flex items-center gap-1.5 shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
              Due Today
            </span>
          </div>

          {/* Bill details */}
          <div className="px-6 py-5">
            {/* Amount row */}
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Amount Due</div>
                <div className="text-4xl font-black mt-1">$65.00</div>
              </div>
              <div className="text-right text-sm text-muted-foreground space-y-0.5">
                <div>Due date: <span className="font-semibold text-foreground">Today</span></div>
                <div className="text-destructive font-medium">Late fee after 3 days: +$12.00</div>
                <div className="text-destructive">Suspension after 7 days</div>
              </div>
            </div>

            {/* Warning strip */}
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 flex gap-3 mb-6">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-snug">
                {currentScenario.description}
              </p>
            </div>

            {/* Choices */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                What do you do?
              </h4>
              <div className="space-y-2">
                {currentScenario.choices.map((c) => (
                  <button
                    key={c.index}
                    disabled={submitting}
                    onClick={() => handleAnswer(c.index)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border border-border bg-card",
                      "hover:border-primary hover:bg-primary/5 transition-smooth",
                      "disabled:opacity-50 group"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                        {String.fromCharCode(65 + c.index)}
                      </span>
                      <span className="text-sm leading-snug">{c.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Educational tip */}
        <div className="rounded-xl bg-muted/50 border border-border/50 px-4 py-3 flex gap-3">
          <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Financial tip: </span>
            Always pay recurring bills before discretionary purchases. A missed bill compounds into late fees, service cuts, and credit damage — far more expensive than waiting on a want.
          </p>
        </div>
      </div>

      {result && <ResultModal result={result} onContinue={handleContinue} />}
    </div>
  );
}
