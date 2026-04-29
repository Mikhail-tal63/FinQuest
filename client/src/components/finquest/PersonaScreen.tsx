import { GraduationCap, Briefcase, Laptop } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { Persona } from "@/lib/api";
import { cn } from "@/lib/utils";

const personas: { key: Persona; title: string; desc: string; Icon: typeof GraduationCap; tone: string }[] = [
  {
    key: "student",
    title: "Student",
    desc: "Focus on managing student loans, part-time income, and early budgeting habits. Ideal for those starting their financial journey.",
    Icon: GraduationCap,
    tone: "text-primary bg-primary/10",
  },
  {
    key: "employee",
    title: "Employee",
    desc: "Navigate salary management, 401k contributions, tax brackets, and steady career progression scenarios.",
    Icon: Briefcase,
    tone: "text-[hsl(255,80%,60%)] bg-[hsl(255,80%,60%)]/10",
  },
  {
    key: "freelancer",
    title: "Freelancer",
    desc: "Master variable income, self-employment taxes, business expenses, and client invoicing dynamics.",
    Icon: Laptop,
    tone: "text-[hsl(150,70%,38%)] bg-[hsl(150,70%,40%)]/10",
  },
];

export function PersonaScreen() {
  const { selectPersona, loading } = useFinQuest();

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Choose Your Persona</h1>
      <p className="mt-4 max-w-xl text-center text-muted-foreground">
        Select a simulation profile that best matches your current financial landscape to begin the experience.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {personas.map(({ key, title, desc, Icon, tone }) => (
          <button
            key={key}
            disabled={loading}
            onClick={() => selectPersona(key)}
            className={cn(
              "group text-left p-7 rounded-2xl bg-card border border-border/60 shadow-card-soft transition-smooth",
              "hover:-translate-y-1 hover:shadow-window hover:border-primary/30",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", tone)}>
              <Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-sm text-muted-foreground animate-pulse">Setting up your simulation…</p>}
    </div>
  );
}
