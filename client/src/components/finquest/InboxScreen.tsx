import { useState } from "react";
import { Mail, Inbox as InboxIcon, Archive, Trash2 } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { api, AnswerResult } from "@/lib/api";
import { ResultModal } from "./ResultModal";
import { cn } from "@/lib/utils";

export function InboxScreen() {
  const { currentScenario, sessionId, loadCurrentScenario, refreshUser, setActiveWindow, setCurrentScenario, setRemainingScenarios } =
    useFinQuest();
  const [selected, setSelected] = useState(true);
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
    }
  };

  if (!currentScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <InboxIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Session Complete</h2>
        <p className="mt-2 text-muted-foreground">No more scenarios in your inbox.</p>
        <button
          onClick={() => setActiveWindow("final")}
          className="mt-6 h-10 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth"
        >
          View Final Report
        </button>
      </div>
    );
  }


  return (
    <div className="h-full flex">
      {/* List pane */}
      <aside className="w-80 border-r border-border/50 flex flex-col bg-card">
        <div className="p-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Inbox</h2>
          <div className="flex bg-muted rounded-full p-0.5 text-xs font-medium">
            <button className="px-3 py-1 rounded-full bg-card shadow-sm">All mail</button>
            <button className="px-3 py-1 text-muted-foreground">Unread</button>
          </div>
        </div>

        <div className="px-3 space-y-1 overflow-auto">
          <button
            onClick={() => setSelected(true)}
            className={cn(
              "w-full text-left p-3 rounded-xl transition-smooth border",
              selected ? "bg-card border-border shadow-sm" : "border-transparent hover:bg-muted/50"
            )}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="font-semibold text-sm truncate">{currentScenario.sender}</span>
              <span className="text-[10px] text-muted-foreground shrink-0">{currentScenario.receivedAt || "now"}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">{currentScenario.subject}</div>
          </button>
        </div>
      </aside>

      {/* Message view */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
          {[Archive, Archive, Trash2].map((I, i) => (
            <button key={i} className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:bg-muted transition-smooth">
              <I className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 overflow-auto">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold">{currentScenario.sender}</h3>
                <span className="text-xs text-muted-foreground">{currentScenario.receivedAt}</span>
              </div>
              <p className="text-sm text-muted-foreground">{currentScenario.subject}</p>
            </div>
          </div>

          <div className="mt-6 text-sm leading-relaxed text-foreground max-w-2xl">{currentScenario.description}</div>

          <div className="mt-8 max-w-2xl">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              How do you respond?
            </h4>
            <div className="space-y-2">
              {currentScenario.choices.map((c) => (
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
        </div>
      </div>

      {result && <ResultModal result={result} onContinue={handleContinue} />}
    </div>
  );
}
