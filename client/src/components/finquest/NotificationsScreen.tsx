import { useState } from "react";
import { Phone, ShieldAlert, MessageSquare, ShoppingBag, Bell, TrendingDown } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { api, AnswerResult } from "@/lib/api";
import { ResultModal } from "./ResultModal";

export function NotificationsScreen() {
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
    } else if (next.source === "sms" || next.source === "notification") {
      // stay on notifications screen
    } else if (next.source === "bills") {
      setActiveWindow("bills");
    } else {
      setActiveWindow("inbox");
    }
  };

  const isNotification =
    currentScenario?.source === "sms" || currentScenario?.source === "notification";

  if (!currentScenario || !isNotification) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">No Notifications</h2>
        <p className="mt-2 text-muted-foreground">You're all caught up. Check your inbox for emails.</p>
        <button
          onClick={() => setActiveWindow("inbox")}
          className="mt-6 h-10 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth"
        >
          Go to Inbox
        </button>
      </div>
    );
  }

  const isSms = currentScenario.source === "sms";

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-sm">
        {/* Screen label */}
        <p className="text-center text-white/50 text-xs mb-4 font-medium tracking-wide uppercase">
          {isSms ? "Messages" : "Notifications"}
        </p>

        {/* Phone frame */}
        <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl border border-white/10">

          {isSms ? (
            /* ── SMS layout ── */
            <>
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{currentScenario.sender}</div>
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
                    <p className="text-white text-sm leading-relaxed">{currentScenario.description}</p>
                    <span className="text-white/30 text-[10px] mt-1.5 block text-right">just now</span>
                  </div>
                </div>

                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-3 py-2.5 flex gap-2.5 items-start">
                  <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-yellow-300/90 text-xs leading-snug">
                    This message is requesting an urgent money transfer. How do you respond?
                  </p>
                </div>

                <div className="space-y-2">
                  {currentScenario.choices.map((c) => (
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
                  <div className="text-white text-sm font-semibold truncate">{currentScenario.sender}</div>
                  <div className="text-white/40 text-xs">Push Notification</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold flex items-center gap-1 shrink-0">
                  <Bell className="w-3 h-3" />
                  Deal Alert
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* Notification card */}
                <div className="bg-[#2c2c2e] rounded-2xl px-4 py-3 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-orange-400 text-[11px] font-semibold uppercase tracking-wide">Flash Sale</span>
                    <span className="text-white/30 text-[10px] ml-auto">just now</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{currentScenario.description}</p>
                </div>

                {/* Warning banner */}
                <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-2.5 flex gap-2.5 items-start">
                  <TrendingDown className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-orange-300/90 text-xs leading-snug">
                    Limited-time deals use urgency and scarcity to trigger impulse buying. What do you do?
                  </p>
                </div>

                <div className="space-y-2">
                  {currentScenario.choices.map((c) => (
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
              </div>
            </>
          )}
        </div>
      </div>

      {result && <ResultModal result={result} onContinue={handleContinue} />}
    </div>
  );
}
