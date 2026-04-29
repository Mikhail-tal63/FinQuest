import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { AnswerResult } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  result: AnswerResult;
  onContinue: () => void;
}

export function ResultModal({ result, onContinue }: Props) {
  const variants = {
    correct: { Icon: CheckCircle2, color: "text-success", bg: "bg-success/10", title: "Correct!" },
    incorrect: { Icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", title: "Incorrect" },
    partial: { Icon: AlertCircle, color: "text-warning", bg: "bg-warning/10", title: "Partial credit" },
  }[result.result];

  const { Icon } = variants;

  const effectRow = (label: string, value: number, suffix = "") => (
    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-semibold", value > 0 ? "text-success" : value < 0 ? "text-destructive" : "")}>
        {value > 0 ? "+" : ""}
        {value}
        {suffix}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-lg rounded-3xl bg-card shadow-window border border-border/50 overflow-hidden animate-scale-in">
        <div className={cn("p-6 flex items-center gap-4", variants.bg)}>
          <Icon className={cn("w-10 h-10", variants.color)} strokeWidth={2} />
          <div>
            <h2 className="text-xl font-bold">{variants.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Decision processed</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm leading-relaxed text-foreground">{result.feedback}</p>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Timeline</h4>
            <ul className="space-y-1.5">
              {result.timeline.map((t, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-muted/50 p-4">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Effects</h4>
            {effectRow("XP", result.effects.xp)}
            {effectRow("Security", result.effects.security)}
            {effectRow("Awareness", result.effects.awareness)}
            {effectRow("Balance", result.effects.balance, " $")}
          </div>

          <button
            onClick={onContinue}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
