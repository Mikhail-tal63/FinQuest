import { Mail, Wallet, User, MessageSquare, Receipt } from "lucide-react";
import { useFinQuest, WindowKey } from "@/context/FinQuestContext";
import { cn } from "@/lib/utils";

const items: { key: WindowKey; label: string; Icon: typeof Mail; gradient: string }[] = [
  { key: "inbox",         label: "Inbox",         Icon: Mail,          gradient: "dock-blue"   },
  { key: "notifications", label: "Notifications",  Icon: MessageSquare, gradient: "dock-violet" },
  { key: "bills",         label: "Bills",          Icon: Receipt,       gradient: "dock-green"  },
  { key: "wallet",        label: "Wallet",         Icon: Wallet,        gradient: "dock-orange" },
  { key: "profile",       label: "Profile",        Icon: User,          gradient: "dock-sky"    },
];

export function Dock() {
  const { activeWindow, setActiveWindow, user, remainingScenarios, currentScenario } = useFinQuest();
  if (!user) return null;

  const hasWalletChallenge = currentScenario?.source === "wallet";
  const hasSmsScenario = currentScenario?.source === "sms" || currentScenario?.source === "notification";
  const hasBillScenario = currentScenario?.source === "bills";

  return (
    <aside className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
      <div className="flex flex-col gap-3 p-3 rounded-3xl bg-white/80 backdrop-blur-xl shadow-dock border border-white">
        {items.map(({ key, label, Icon, gradient }) => {
          const active = activeWindow === key;
          const badge =
            key === "inbox" && !hasWalletChallenge && !hasSmsScenario && !hasBillScenario && remainingScenarios > 0
              ? remainingScenarios
              : key === "wallet" && hasWalletChallenge
              ? 1
              : key === "notifications" && hasSmsScenario
              ? 1
              : key === "bills" && hasBillScenario
              ? 1
              : 0;

          return (
            <button
              key={key}
              onClick={() => setActiveWindow(key)}
              title={label}
              className={cn(
                "group relative w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-smooth shadow-icon",
                gradient,
                active ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-white" : "hover:scale-110"
              )}
            >
              <Icon className="w-7 h-7" strokeWidth={2.2} />
              {active && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none shadow-sm">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
