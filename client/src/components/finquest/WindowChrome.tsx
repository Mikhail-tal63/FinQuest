import { ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

export function WindowChrome({ title = "FinQuest", children }: Props) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-card shadow-window border border-border/40 flex flex-col animate-scale-in">
      {/* Title bar */}
      <div className="h-9 flex items-center px-4 bg-secondary/80 backdrop-blur border-b border-border/40 shrink-0">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[hsl(0,80%,65%)]" />
          <span className="w-3 h-3 rounded-full bg-[hsl(45,90%,60%)]" />
          <span className="w-3 h-3 rounded-full bg-[hsl(140,60%,55%)]" />
        </div>
        <div className="flex-1 text-center text-xs font-medium text-muted-foreground select-none">
          {title}
        </div>
        <div className="w-12" />
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
