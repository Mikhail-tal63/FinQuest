import { useEffect, useState } from "react";
import { Trophy, Shield, Eye, Wallet as WalletIcon } from "lucide-react";
import { api, FinalReport as Report } from "@/lib/api";
import { useFinQuest } from "@/context/FinQuestContext";

export function FinalReport() {
  const { sessionId } = useFinQuest();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (sessionId) api.getResult(sessionId).then(setReport);
  }, [sessionId]);

  if (!report) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">Loading report…</div>;
  }

  const stats = [
    { Icon: Shield, label: "Security", value: report.finalScores.security, suffix: "/100" },
    { Icon: Eye, label: "Awareness", value: report.finalScores.awareness, suffix: "/100" },
    { Icon: WalletIcon, label: "Balance", value: `$${report.finalScores.balance.toLocaleString()}`, suffix: "" },
  ];

  return (
    <div className="min-h-full p-10 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full dock-orange flex items-center justify-center text-white shadow-icon">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="mt-6 text-4xl font-bold">Session Complete</h1>
        <p className="mt-2 text-muted-foreground">Here's a summary of your financial journey.</p>
      </div>

      <div className="mt-10 rounded-2xl p-8 bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] text-primary-foreground shadow-window text-center">
        <div className="text-sm uppercase tracking-wider opacity-80">Total XP Earned</div>
        <div className="mt-2 text-6xl font-bold">{report.totalXp.toLocaleString()}</div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ Icon, label, value, suffix }) => (
          <div key={label} className="p-5 rounded-2xl bg-card border border-border/50 shadow-card-soft">
            <Icon className="w-5 h-5 text-primary" />
            <div className="mt-3 text-2xl font-bold">{value}{suffix}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border/50 shadow-card-soft p-6">
        <h3 className="font-semibold mb-4">Attempts Summary</h3>
        <div className="space-y-2">
          {report.attempts.map((a, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
              <span className="text-sm">{a.scenario}</span>
              <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${
                a.result === "correct" ? "bg-success/10 text-success" :
                a.result === "incorrect" ? "bg-destructive/10 text-destructive" :
                "bg-warning/10 text-warning"
              }`}>{a.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
