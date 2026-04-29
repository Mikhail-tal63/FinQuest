import { Star, CheckCircle2, Pencil } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";

export function ProfileScreen() {
  const { user } = useFinQuest();
  if (!user) return null;
  const level = Math.floor(user.xp / 250) + 1;
  const xpInLevel = user.xp % 250;
  const nextLevelXp = 250;

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-10">
      <div className="relative">
        <div className="w-24 h-24 rounded-full dock-blue flex items-center justify-center text-white text-3xl font-bold shadow-icon">
          {user.persona[0].toUpperCase()}
        </div>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          Level {level}
        </span>
      </div>

      <h2 className="mt-6 text-3xl font-bold tracking-wide uppercase">{user.persona}</h2>

      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">XP Progress</span>
          <span className="text-primary font-semibold">{xpInLevel} / {nextLevelXp}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(xpInLevel / nextLevelXp) * 100}%` }} />
        </div>
        <div className="text-center text-xs text-muted-foreground mt-2">
          {nextLevelXp - xpInLevel} XP to next level
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card-soft text-center">
          <Star className="w-5 h-5 mx-auto text-primary" />
          <div className="mt-2 text-2xl font-bold">{user.xp.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total XP</div>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card-soft text-center">
          <CheckCircle2 className="w-5 h-5 mx-auto text-[hsl(20,95%,55%)]" />
          <div className="mt-2 text-2xl font-bold">{user.awarenessScore}</div>
          <div className="text-xs text-muted-foreground">Awareness</div>
        </div>
      </div>

      <button className="mt-8 w-full max-w-md h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2">
        <Pencil className="w-4 h-4" /> Edit Profile
      </button>
    </div>
  );
}
