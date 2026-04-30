import { useState, useEffect } from "react";
import { Phone, ShieldAlert, MessageSquare, ShoppingBag, Bell, TrendingDown, Clock, CheckCheck } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { AnswerResult, Scenario } from "@/lib/api";
import { ResultModal } from "./ResultModal";
import { cn } from "@/lib/utils";

export function NotificationsScreen() {
  const { allScenarios, answeredIds, gameDay, answerScenario } = useFinQuest();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult]         = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const notifScenarios = allScenarios
    .filter(s => (s.source === "sms" || s.source === "notification") && s.scheduledDay <= gameDay)
    .sort((a, b) => a.scheduledDay - b.scheduledDay);

  const activeScenario: Scenario | null =
    notifScenarios.find(s => !answeredIds.has(s.id)) ?? null;

  useEffect(() => {
    if (activeScenario) setSelectedId(activeScenario.id);
  }, [activeScenario?.id]);

  const viewedScenario = notifScenarios.find(s => s.id === selectedId) ?? activeScenario;

  const handleAnswer = async (choiceIndex: number) => {
    if (!viewedScenario || submitting) return;
    setSubmitting(true);
    try {
      const r = await answerScenario(viewedScenario.id, choiceIndex);
      setResult(r);
    } finally {
      setSubmitting(false);
    }
  };

  const isCurrentViewed = viewedScenario?.id === activeScenario?.id;
  const isAnswered      = viewedScenario ? answeredIds.has(viewedScenario.id) : false;

  // ── Empty state ────────────────────────────────────────────────────────────

  if (notifScenarios.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">No Notifications</h2>
        <p className="mt-2 text-muted-foreground">You're all caught up — check back as the month progresses.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* ── List pane ──────────────────────────────────────────────────────── */}
      <aside className="w-72 border-r border-border/50 flex flex-col bg-card shrink-0">
        <div className="p-5 shrink-0">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {notifScenarios.filter(s => !answeredIds.has(s.id)).length} unread
          </p>
        </div>

        <div className="px-3 space-y-1 overflow-auto flex-1">
          {notifScenarios.map(scenario => {
            const isSelected = selectedId === scenario.id;
            const isRead     = answeredIds.has(scenario.id);
            const isActive   = scenario.id === activeScenario?.id;
            const isSms      = scenario.source === "sms";
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
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                      isSms ? "bg-red-100 dark:bg-red-900/30" : "bg-orange-100 dark:bg-orange-900/30"
                    )}>
                      {isSms
                        ? <Phone className="w-3 h-3 text-red-500" />
                        : <Bell className="w-3 h-3 text-orange-500" />
                      }
                    </div>
                    <span className={cn("text-sm truncate", isRead ? "font-normal text-muted-foreground" : "font-semibold")}>
                      {scenario.sender}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Day {scenario.scheduledDay}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate pl-8">{scenario.subject}</div>
                {isActive && !isRead && (
                  <div className="mt-1 ml-8 w-2 h-2 rounded-full bg-primary inline-block" />
                )}
              </button>
            );
          })}

          {/* Unrevealed previews */}
          {allScenarios
            .filter(s => (s.source === "sms" || s.source === "notification") && s.scheduledDay > gameDay)
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

      {/* ── Phone view ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-6 overflow-auto">
        {viewedScenario ? (
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/50 text-xs font-medium tracking-wide uppercase">
                {viewedScenario.source === "sms" ? "Messages" : "Notifications"}
              </p>
              {isAnswered && (
                <span className="text-xs text-green-400/80 italic flex items-center gap-1.5">
                  <CheckCheck className="w-3.5 h-3.5" /> Handled
                </span>
              )}
            </div>

            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {viewedScenario.source === "sms" ? (
                /* ── SMS layout ── */
                <>
                  <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{viewedScenario.sender}</div>
                      <div className="text-white/40 text-xs">Unknown Number</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold flex items-center gap-1 shrink-0">
                      <ShieldAlert className="w-3 h-3" />
                      Suspicious
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-[#2c2c2e] rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-white text-sm leading-relaxed">{viewedScenario.description}</p>
                        <span className="text-white/30 text-[10px] mt-1.5 block text-right">Day {viewedScenario.scheduledDay}</span>
                      </div>
                    </div>

                    {isCurrentViewed && !isAnswered && (
                      <>
                        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-3 py-2.5 flex gap-2.5 items-start">
                          <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                          <p className="text-yellow-300/90 text-xs leading-snug">
                            This message is requesting an urgent money transfer. How do you respond?
                          </p>
                        </div>
                        <div className="space-y-2">
                          {viewedScenario.choices.map(c => (
                            <button
                              key={c.index}
                              disabled={submitting}
                              onClick={() => handleAnswer(c.index)}
                              className="w-full text-left px-3.5 py-3 rounded-2xl bg-[#2c2c2e] border border-white/10 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-200 disabled:opacity-50 group"
                            >
                              <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/10 text-white/60 text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                  {String.fromCharCode(65 + c.index)}
                                </span>
                                <span className="text-white/90 text-sm leading-snug">{c.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {isAnswered && (
                      <div className="text-center py-2">
                        <span className="text-xs text-green-400/70 italic">You've already handled this message.</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ── Push notification layout ── */
                <>
                  <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{viewedScenario.sender}</div>
                      <div className="text-white/40 text-xs">Push Notification · Day {viewedScenario.scheduledDay}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold flex items-center gap-1 shrink-0">
                      <Bell className="w-3 h-3" />
                      Deal Alert
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="bg-[#2c2c2e] rounded-2xl px-4 py-3 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-orange-400 text-[11px] font-semibold uppercase tracking-wide">Flash Sale</span>
                        <span className="text-white/30 text-[10px] ml-auto">Day {viewedScenario.scheduledDay}</span>
                      </div>
                      <p className="text-white text-sm leading-relaxed">{viewedScenario.description}</p>
                    </div>

                    {isCurrentViewed && !isAnswered && (
                      <>
                        <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-2.5 flex gap-2.5 items-start">
                          <TrendingDown className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                          <p className="text-orange-300/90 text-xs leading-snug">
                            Limited-time deals use urgency and scarcity to trigger impulse buying. What do you do?
                          </p>
                        </div>
                        <div className="space-y-2">
                          {viewedScenario.choices.map(c => (
                            <button
                              key={c.index}
                              disabled={submitting}
                              onClick={() => handleAnswer(c.index)}
                              className="w-full text-left px-3.5 py-3 rounded-2xl bg-[#2c2c2e] border border-white/10 hover:border-orange-400/50 hover:bg-orange-500/10 transition-all duration-200 disabled:opacity-50 group"
                            >
                              <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/10 text-white/60 text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                  {String.fromCharCode(65 + c.index)}
                                </span>
                                <span className="text-white/90 text-sm leading-snug">{c.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {isAnswered && (
                      <div className="text-center py-2">
                        <span className="text-xs text-green-400/70 italic">You've already handled this notification.</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-white/40 text-sm">Select a notification to view it.</div>
        )}
      </div>

      {result && <ResultModal result={result} onContinue={() => setResult(null)} />}
    </div>
  );
}
