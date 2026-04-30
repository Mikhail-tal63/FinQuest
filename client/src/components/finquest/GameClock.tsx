import { Calendar } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const BASE_MONTH = 3; // April (0-indexed)
const BASE_YEAR = 2026;

export function GameClock() {
  const { gameDay, gameHour, sessionId } = useFinQuest();
  if (!sessionId) return null;

  const monthOffset = Math.floor((gameDay - 1) / 30);
  const monthIdx = (BASE_MONTH + monthOffset) % 12;
  const year = BASE_YEAR + Math.floor((BASE_MONTH + monthOffset) / 12);
  const progress = ((gameDay - 1) % 30) / 29; // 0→1 across the month

  const hh = String(gameHour).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-background/80">
      <Calendar className="w-3 h-3 opacity-60" />
      <span className="font-mono text-xs">
        Day {gameDay} · {MONTH_NAMES[monthIdx]} {year} · {hh}:00
      </span>
      {/* Month progress bar */}
      <div className="w-16 h-1 rounded-full bg-background/20 overflow-hidden">
        <div
          className="h-full bg-background/70 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
      {gameDay > 25 && (
        <span className="text-[10px] font-semibold text-amber-300 animate-pulse">
          Month ending soon
        </span>
      )}
    </div>
  );
}
