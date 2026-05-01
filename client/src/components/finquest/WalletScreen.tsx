import { useEffect, useState, useRef } from "react";
import {
  AlertTriangle, ShieldOff, ShieldCheck, X, Lock,
  ArrowDownLeft, ArrowUpRight, CreditCard, TrendingDown, TrendingUp,
} from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { cn } from "@/lib/utils";

export function WalletScreen() {
  const { user, salary, computedBalance, refreshUser, transactions, accountFrozen, freezeAccount } = useFinQuest();

  const [alertDismissed, setAlertDismissed]   = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);

  // ── Balance animation state ─────────────────────────────────────────────────
  const prevBalanceRef = useRef<number | null>(null);
  const [balanceDelta, setBalanceDelta]   = useState<number | null>(null);
  const [flashType, setFlashType]         = useState<"gain" | "loss" | null>(null);
  const [deltaVisible, setDeltaVisible]   = useState(false);

  // ── Newest transaction highlight ────────────────────────────────────────────
  const [newestTxId, setNewestTxId] = useState<string | null>(null);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  // Detect balance change → trigger flash + delta badge
  useEffect(() => {
    if (prevBalanceRef.current === null) {
      prevBalanceRef.current = computedBalance;
      return;
    }
    const diff = computedBalance - prevBalanceRef.current;
    if (diff !== 0) {
      prevBalanceRef.current = computedBalance;
      setBalanceDelta(diff);
      setFlashType(diff > 0 ? "gain" : "loss");
      setDeltaVisible(true);
      const hide = setTimeout(() => setDeltaVisible(false), 2200);
      const clear = setTimeout(() => {
        setBalanceDelta(null);
        setFlashType(null);
      }, 2700);
      return () => { clearTimeout(hide); clearTimeout(clear); };
    }
    prevBalanceRef.current = computedBalance;
  }, [computedBalance]);

  // Highlight newest transaction for 2s when list grows
  useEffect(() => {
    if (transactions.length === 0) return;
    setAlertDismissed(false);
    const id = transactions[0].id;
    setNewestTxId(id);
    const t = setTimeout(() => setNewestTxId(null), 2000);
    return () => clearTimeout(t);
  }, [transactions.length]);

  if (!user) return null;

  const lastDebit    = transactions.find(t => t.type === "debit");
  const totalDebits  = transactions.filter(t => t.type === "debit").reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalCredits = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const netChange    = totalCredits - totalDebits;

  return (
    <div className="p-8 max-w-5xl mx-auto overflow-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your cards and account overview.</p>
      </div>

      {/* Fraud alert */}
      {lastDebit && !alertDismissed && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive animate-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <span className="font-semibold">Security Alert: </span>
            A debit of <span className="font-semibold">${Math.abs(lastDebit.amount).toLocaleString()}</span> was
            recorded via &ldquo;{lastDebit.label}&rdquo;.
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── Bank card ─────────────────────────────────────────────────────── */}
        <div className={cn(
          "lg:col-span-2 rounded-3xl p-6 text-white shadow-card-soft flex flex-col justify-between min-h-[230px] transition-all duration-500",
          accountFrozen
            ? "bg-gradient-to-br from-slate-600 to-slate-800"
            : "bg-gradient-to-br from-[hsl(222,47%,11%)] to-[hsl(222,47%,20%)]"
        )}>
          {/* Top row */}
          <div className="flex justify-between items-start">
            <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-sm">
              <div className="w-6 h-4 rounded-sm border border-yellow-600/40 grid grid-cols-2 gap-px p-px opacity-70">
                <div className="bg-yellow-600/40 rounded-sm" />
                <div className="bg-yellow-600/40 rounded-sm" />
                <div className="bg-yellow-600/40 rounded-sm" />
                <div className="bg-yellow-600/40 rounded-sm" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {accountFrozen && <Lock className="w-4 h-4 opacity-60" />}
              <span className="font-black tracking-widest italic text-lg">VISA</span>
            </div>
          </div>

          {/* Balance + delta badge */}
          <div>
            <div className="text-white/50 text-xs uppercase tracking-widest mb-1">Available Balance</div>
            <div className="flex items-baseline gap-3">
              <div className={cn(
                "text-4xl font-bold tabular-nums transition-colors duration-300",
                accountFrozen   ? "opacity-60" :
                flashType === "gain" ? "text-emerald-300" :
                flashType === "loss" ? "text-red-300" : "text-white"
              )}>
                ${computedBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>

              {/* Delta badge — slides in, fades out */}
              {balanceDelta !== null && (
                <span className={cn(
                  "text-sm font-bold px-2 py-0.5 rounded-full transition-all duration-500",
                  deltaVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
                  balanceDelta > 0
                    ? "bg-emerald-400/20 text-emerald-300"
                    : "bg-red-400/20 text-red-300"
                )}>
                  {balanceDelta > 0 ? "+" : ""}
                  {balanceDelta.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
            <div className="mt-1 text-white/40 text-xs">
              Monthly salary: <span className="text-white/70 font-medium">+${salary.toLocaleString()}</span>
            </div>
          </div>

          {/* Card details */}
          <div>
            <div className="font-mono tracking-widest text-sm text-white/80 mb-3">
              {accountFrozen ? "•••• •••• •••• ••••" : "•••• •••• •••• 4289"}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Cardholder</div>
                <div className="text-sm font-semibold capitalize">{user.persona} User</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-white/40 uppercase tracking-wider">
                  {accountFrozen ? "Status" : "Expires"}
                </div>
                <div className={cn("text-sm font-semibold", accountFrozen && "text-red-300")}>
                  {accountFrozen ? "FROZEN" : "12/26"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right tiles ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-5">

          {/* Monthly Income */}
          <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" /> Monthly Income
            </div>
            <div className="text-3xl font-bold text-emerald-600">
              +${salary.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Credited on Day 1</div>
          </div>

          {/* Net Change — updates live */}
          <div className={cn(
            "rounded-2xl p-5 border shadow-card-soft transition-colors duration-500",
            flashType === "gain" ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" :
            flashType === "loss" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" :
                                   "bg-card border-border/50"
          )}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              {netChange >= 0
                ? <TrendingUp   className="w-3.5 h-3.5 text-emerald-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              }
              Net This Month
            </div>
            <div className={cn(
              "text-3xl font-bold tabular-nums transition-colors duration-300",
              netChange >= 0 ? "text-emerald-600" : "text-destructive"
            )}>
              {netChange >= 0 ? "+" : ""}${netChange.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Virtual card + freeze */}
          <div className="col-span-2 rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0",
              accountFrozen ? "bg-slate-500" : "dock-blue"
            )}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Virtual Card</div>
              <div className={cn("text-xs mt-0.5", accountFrozen ? "text-destructive font-medium" : "text-muted-foreground")}>
                {accountFrozen ? "Frozen · All transactions blocked" : "Active · Online purchases only"}
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-1">
                {accountFrozen ? "•••• ••••" : "•••• 8821"} · CVV •••
              </div>
            </div>
            <button
              onClick={() => accountFrozen ? null : setFreezeModalOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-smooth shrink-0",
                accountFrozen
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-default"
                  : "bg-destructive/10 text-destructive hover:bg-destructive/20"
              )}
            >
              <Lock className="w-3.5 h-3.5" />
              {accountFrozen ? "Frozen" : "Freeze"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Transactions ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl p-5 bg-card border border-border/50 shadow-card-soft">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Recent Transactions</h3>
          <span className="text-xs text-muted-foreground">{transactions.length} total</span>
        </div>
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No transactions yet — they'll appear here as you answer scenarios.
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.slice(0, 8).map(t => (
              <div
                key={t.id}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-xl transition-all duration-700",
                  t.id === newestTxId
                    ? t.type === "debit"
                      ? "bg-red-50 dark:bg-red-950/30"
                      : "bg-emerald-50 dark:bg-emerald-950/30"
                    : "hover:bg-muted/40"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300",
                  t.id === newestTxId && "scale-110",
                  t.type === "debit"  ? "bg-destructive/10 text-destructive" :
                  t.type === "credit" ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600" :
                                        "bg-slate-100 dark:bg-slate-800 text-slate-500"
                )}>
                  {t.type === "debit"  ? <AlertTriangle className="w-4 h-4" /> :
                   t.type === "credit" ? <ShieldCheck   className="w-4 h-4" /> :
                                          <Lock          className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.sublabel}</div>
                </div>
                <div className={cn(
                  "text-sm font-semibold shrink-0 tabular-nums transition-all duration-300",
                  t.id === newestTxId && "scale-105",
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
