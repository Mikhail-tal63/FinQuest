import { useFinQuest } from "@/context/FinQuestContext";
import { Dock } from "./Dock";
import { WindowChrome } from "./WindowChrome";
import { PersonaScreen } from "./PersonaScreen";
import { InboxScreen } from "./InboxScreen";
import { WalletScreen } from "./WalletScreen";
import { NotificationsScreen } from "./NotificationsScreen";
import { BillsScreen } from "./BillsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { FinalReport } from "./FinalReport";
import { GameClock } from "./GameClock";

export function DesktopLayout() {
  const { activeWindow, user } = useFinQuest();

  const renderWindow = () => {
    if (!user || activeWindow === "persona") return <PersonaScreen />;
    switch (activeWindow) {
      case "inbox":         return <InboxScreen />;
      case "wallet":        return <WalletScreen />;
      case "notifications": return <NotificationsScreen />;
      case "bills":         return <BillsScreen />;
      case "profile":       return <ProfileScreen />;
      case "final":         return <FinalReport />;
      default:              return <InboxScreen />;
    }
  };

  return (
    <div className="min-h-screen w-full desktop-bg flex flex-col">
      <header className="h-8 px-4 flex items-center justify-between bg-foreground/90 backdrop-blur text-background text-xs font-medium shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">FinQuest</span>
          <span className="opacity-50">•</span>
          <span className="opacity-70">Financial Simulation Platform</span>
        </div>
        <GameClock />
      </header>

      <main className="flex-1 relative p-6">
        <Dock />
        <div className="ml-24 h-[calc(100vh-4rem)]">
          <WindowChrome title="FinQuest">{renderWindow()}</WindowChrome>
        </div>
      </main>
    </div>
  );
}
