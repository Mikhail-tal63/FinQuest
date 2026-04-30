import { useEffect, useState } from "react";
import { TrendingDown, Landmark, AlertTriangle, ShieldOff, ShieldCheck, X, Lock } from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { cn } from "@/lib/utils";

export function WalletScreen() {
  const { user, refreshUser, transactions, accountFrozen, freezeAccount } = useFinQuest();
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);

  useEffect(() => { refreshUser(); }, [refreshUser]);
  useEffect(() => { setAlertDismissed(false); }, [transactions.length]);

  if (!user) return null;

  const credit = 25000 - user.balance;
  const lastDebit = transactions.find(t => t.type === "debit");
  const sessionLosses = transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="p-10 max-w-6xl mx-auto overflow-auto">
      <h1 className="text-4xl font-bold tracking-tight">Wallet</h1>
      <p className="mt-2 text-muted-foreground">Manage your cards and view spending insights.</p>

      {/* Fraud alert */}
      {lastDebit && !alertDismissed && (
        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="font-semibold">Security Alert: </span>
            Your account was compromised.{" "}
            <span className="font-semibold">${Math.abs(lastDebit.amount).toLocaleString()}</span> was
            transferred out via &ldquo;{lastDebit.label}&rdquo;.
            {!accountFrozen && (
              <button onClick={() => setFreezeModalOpen(true)} className="ml-2 underline font-medium hover:no-underline">
                Freeze Account
              </button>
            )}
          </div>
          <button onClick={() => setAlertDismissed(true)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visa card */}
        <div className={cn(
          "lg:row-span-2 rounded-2xl p-6 text-white shadow-card-soft min-h-[220px] flex flex-col justify-between transition-all duration-500",
          accountFrozen
            ? "bg-gradient-to-br from-slate-600 to-slate-800"
            : "bg-gradient-to-br from-[hsl(222,47%,11%)] to-[hsl(222,47%,18%)]"
        )}>
          <div className="flex justify-between items-start">
            <div className="w-10 h-8 rounded-md bg-white/15 backdrop-blur" />
            <div className="flex items-center gap-2">
              {accountFrozen && <Lock className="w-4 h-4 opacity-60" />}
              <span className="font-bold tracking-wider italic">VISA</span>
            </div>
          </div>
          <div>
            <div className="font-mono tracking-widest text-lg">
              {accountFrozen ? "•••• •••• •••• ••••" : "•••• •••• •••• 4289"}
            </div>
            <div className="mt-4 flex justify-between text-xs uppercase opacity-70">
              <span>Cardholder Name</span>
              <span>{accountFrozen ? "Status" : "Expires"}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="capitalize">{user.persona} User</span>
              <span className={accountFrozen ? "text-red-300 font-bold" : ""}>
                {accountFrozen ? "FROZEN" : "12/26"}
              </span>
            </div>
          </div>
        </div>

        {/* Session losses */}
        <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5" /> Total Losses This Session
          </div>
          <div className="mt-2 text-3xl font-bold text-destructive">
            {sessionLosses > 0 ? `-$${sessionLosses.toLocaleString()}` : "$0"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {transactions.filter(t => t.type === "debit").length} incident
            {transactions.filter(t => t.type === "debit").length !== 1 ? "s" : ""} recorded
          </div>
        </div>

        {/* Available credit */}
        <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Landmark className="w-3.5 h-3.5" /> Available Credit
          </div>
          <div className="mt-2 text-3xl font-bold">${credit.toLocaleString()}</div>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${Math.min(100, (credit / 25000) * 100)}%` }} />
          </div>
        </div>

        {/* Virtual card + Freeze */}
        <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold",
              accountFrozen ? "bg-slate-500" : "dock-blue"
            )}>VC</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Virtual Card</div>
              <div className={cn("text-xs", accountFrozen ? "text-destructive font-medium" : "text-muted-foreground")}>
                {accountFrozen ? "Frozen · Transactions blocked" : "Active · Online only"}
              </div>
            </div>
          </div>
          <div className="font-mono text-sm tracking-wider text-muted-foreground">
            {accountFrozen ? "•••• ••••" : "•••• 8821"}
          </div>
          <button
            onClick={() => accountFrozen ? null : setFreezeModalOpen(true)}
            className={cn(
              "mt-1 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium transition-smooth",
              accountFrozen
                ? "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-default"
                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
            )}
          >
            {accountFrozen
              ? <><Lock className="w-3.5 h-3.5" /> Account Frozen</>
              : <><ShieldOff className="w-3.5 h-3.5" /> Freeze Account</>}
          </button>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <span className="text-xs text-muted-foreground">{transactions.length} total</span>
          </div>
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No transactions yet. They'll appear here as you progress.
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 6).map(t => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                    t.type === "debit"  ? "bg-destructive/10 text-destructive" :
                    t.type === "credit" ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600" :
                                          "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  )}>
                    {t.type === "debit"  ? <AlertTriangle className="w-4 h-4" /> :
                     t.type === "credit" ? <ShieldCheck className="w-4 h-4" /> :
                                           <Lock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.sublabel}</div>
                  </div>
                  <div className={cn(
                    "text-sm font-semibold shrink-0",
                    t.type === "debit"  ? "text-destructive" :
                    t.type === "credit" ? "text-emerald-600" :
                                          "text-muted-foreground"
                  )}>
                    {t.amount < 0 ? `-$${Math.abs(t.amount).toLocaleString()}` :
                     t.amount > 0 ? `+$${t.amount.toLocaleString()}` : "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Balance",         value: `$${user.balance.toLocaleString()}` },
          { label: "XP",              value: user.xp.toLocaleString() },
          { label: "Security Score",  value: `${user.securityScore}/100` },
          { label: "Awareness Score", value: `${user.awarenessScore}/100` },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 bg-card border border-border/50 shadow-card-soft">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Freeze modal */}
      {freezeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-2xl bg-card border border-border shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldOff className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold">Freeze Your Account?</h3>
                <p className="text-xs text-muted-foreground">This will block all card transactions.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Freezing your account will temporarily block all new purchases and transfers.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setFreezeModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={() => { freezeAccount(); setFreezeModalOpen(false); }}
                className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-smooth flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Freeze Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
