import { useState, useEffect } from "react";
import {
  Receipt, Wifi, Zap, Phone, Tv, Home, AlertCircle, CheckCircle2, Clock,
  Bus, Wrench, Music, Dumbbell, Package, Film, Coffee, Gamepad2, ShoppingCart,
} from "lucide-react";
import { useFinQuest } from "@/context/FinQuestContext";
import { AnswerResult, Scenario, Persona } from "@/lib/api";
import { ResultModal } from "./ResultModal";
import { cn } from "@/lib/utils";

// ── Expense data (also used by FinalReport) ───────────────────────────────────

export interface Expense {
  id: string;
  label: string;
  amount: number;
  icon: React.ElementType;
  mandatory: boolean;
}

export const EXPENSES: Record<Persona, Expense[]> = {
  student: [
    { id: "rent",        label: "Rent",           amount: 600,   icon: Home,         mandatory: true  },
    { id: "electricity", label: "Electricity",    amount: 40,    icon: Zap,          mandatory: true  },
    { id: "internet",    label: "Internet",       amount: 65,    icon: Wifi,         mandatory: true  },
    { id: "phone",       label: "Phone Plan",     amount: 30,    icon: Phone,        mandatory: true  },
    { id: "groceries",   label: "Groceries",      amount: 200,   icon: ShoppingCart, mandatory: true  },
    { id: "netflix",     label: "Netflix",        amount: 15.99, icon: Tv,           mandatory: false },
    { id: "spotify",     label: "Spotify",        amount: 9.99,  icon: Music,        mandatory: false },
    { id: "gym",         label: "Gym",            amount: 29.99, icon: Dumbbell,     mandatory: false },
    { id: "amazon",      label: "Amazon Prime",   amount: 14.99, icon: Package,      mandatory: false },
    { id: "gaming",      label: "Gaming Pass",    amount: 14.99, icon: Gamepad2,     mandatory: false },
  ],
  employee: [
    { id: "rent",        label: "Rent",           amount: 1200,  icon: Home,         mandatory: true  },
    { id: "electricity", label: "Electricity",    amount: 80,    icon: Zap,          mandatory: true  },
    { id: "internet",    label: "Internet",       amount: 65,    icon: Wifi,         mandatory: true  },
    { id: "phone",       label: "Phone Plan",     amount: 50,    icon: Phone,        mandatory: true  },
    { id: "groceries",   label: "Groceries",      amount: 400,   icon: ShoppingCart, mandatory: true  },
    { id: "transport",   label: "Transport",      amount: 120,   icon: Bus,          mandatory: true  },
    { id: "netflix",     label: "Netflix",        amount: 15.99, icon: Tv,           mandatory: false },
    { id: "spotify",     label: "Spotify",        amount: 9.99,  icon: Music,        mandatory: false },
    { id: "gym",         label: "Gym",            amount: 49.99, icon: Dumbbell,     mandatory: false },
    { id: "amazon",      label: "Amazon Prime",   amount: 14.99, icon: Package,      mandatory: false },
    { id: "disney",      label: "Disney+",        amount: 13.99, icon: Film,         mandatory: false },
    { id: "coffee",      label: "Coffee Shop",    amount: 60,    icon: Coffee,       mandatory: false },
  ],
  freelancer: [
    { id: "rent",        label: "Rent",           amount: 1000,  icon: Home,         mandatory: true  },
    { id: "electricity", label: "Electricity",    amount: 70,    icon: Zap,          mandatory: true  },
    { id: "internet",    label: "Internet",       amount: 65,    icon: Wifi,         mandatory: true  },
    { id: "phone",       label: "Phone Plan",     amount: 45,    icon: Phone,        mandatory: true  },
    { id: "groceries",   label: "Groceries",      amount: 350,   icon: ShoppingCart, mandatory: true  },
    { id: "tools",       label: "Software Tools", amount: 50,    icon: Wrench,       mandatory: true  },
    { id: "netflix",     label: "Netflix",        amount: 15.99, icon: Tv,           mandatory: false },
    { id: "spotify",     label: "Spotify",        amount: 9.99,  icon: Music,        mandatory: false },
    { id: "gym",         label: "Gym",            amount: 39.99, icon: Dumbbell,     mandatory: false },
    { id: "amazon",      label: "Amazon Prime",   amount: 14.99, icon: Package,      mandatory: false },
    { id: "coffee",      label: "Coffee Shop",    amount: 45,    icon: Coffee,       mandatory: false },
  ],
};

// ── Bill helpers ──────────────────────────────────────────────────────────────

const BILL_ICONS: Record<string, React.ElementType> = {
  internet_bill: Wifi,
  utility: Zap,
  phone: Phone,
  tv: Tv,
  rent: Home,
};

function billIcon(scenario: Scenario): React.ElementType {
  return BILL_ICONS[scenario.type] ?? Receipt;
}

type BillStatus = "paid" | "due" | "upcoming";

function billStatus(scenario: Scenario, answeredIds: Set<string>, gameDay: number): BillStatus {
  if (answeredIds.has(scenario.id)) return "paid";
  if (scenario.scheduledDay <= gameDay) return "due";
  return "upcoming";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BillsScreen() {
  const {
    user,
    allScenarios,
    answeredIds,
    gameDay,
    answerScenario,
    setActiveWindow,
    optionalOff,
    toggleOptional,
  } = useFinQuest();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult]         = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // All bill scenarios (revealed + upcoming)
  const allBills = allScenarios
    .filter(s => s.source === "bills")
    .sort((a, b) => a.scheduledDay - b.scheduledDay);

  // First unanswered revealed bill
  const activeBill: Scenario | null =
    allBills.find(s => s.scheduledDay <= gameDay && !answeredIds.has(s.id)) ?? null;

  useEffect(() => {
    if (activeBill) setSelectedId(activeBill.id);
  }, [activeBill?.id]);

  const viewedBill = allBills.find(s => s.id === selectedId) ?? activeBill;

  const expenses       = user ? EXPENSES[user.persona] : [];
  const mandatoryTotal = expenses.filter(e => e.mandatory).reduce((s, e) => s + e.amount, 0);
  const optionalTotal  = expenses.filter(e => !e.mandatory && !optionalOff.has(e.id)).reduce((s, e) => s + e.amount, 0);
  const grandTotal     = mandatoryTotal + optionalTotal;

  const handleAnswer = async (choiceIndex: number) => {
    if (!viewedBill || submitting) return;
    setSubmitting(true);
    try {
      const r = await answerScenario(viewedBill.id, choiceIndex);
      setResult(r);
    } finally {
      setSubmitting(false);
    }
  };

  const viewedStatus = viewedBill ? billStatus(viewedBill, answeredIds, gameDay) : null;
  const isActiveBill = viewedBill?.id === activeBill?.id;

  if (allBills.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold">No Bills</h2>
        <p className="mt-2 text-muted-foreground">No bills are scheduled for this session.</p>
        <button
          onClick={() => setActiveWindow("inbox")}
          className="mt-6 h-10 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-smooth"
        >
          Go to Inbox
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* ── Left pane ──────────────────────────────────────────────────────── */}
      <aside className="w-80 border-r border-border/50 flex flex-col bg-card shrink-0 overflow-y-auto">

        {/* Bills section */}
        <div className="p-5 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-bold">Bills</h2>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {allBills.filter(b => billStatus(b, answeredIds, gameDay) === "due").length} due now
          </p>
        </div>

        <div className="px-3 py-3 space-y-1.5 shrink-0">
          {allBills.map(bill => {
            const status     = billStatus(bill, answeredIds, gameDay);
            const isSelected = bill.id === selectedId;
            const Icon       = billIcon(bill);
            return (
              <button
                key={bill.id}
                onClick={() => setSelectedId(bill.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-smooth",
                  isSelected ? "bg-background border-border shadow-sm" : "border-transparent hover:bg-muted/50",
                  status === "upcoming" && "opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    status === "paid"     ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                    status === "due"      ? "bg-red-100 dark:bg-red-900/30 text-red-600" :
                                           "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-sm truncate", status === "paid" ? "text-muted-foreground" : "font-semibold")}>
                      {bill.sender}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {status === "upcoming" ? `Arrives Day ${bill.scheduledDay}` : bill.subject}
                    </div>
                  </div>
                  {status === "paid"     && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                  {status === "due"      && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                  {status === "upcoming" && <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Expenses section ────────────────────────────────────────────── */}
        <div className="border-t border-border/50 shrink-0">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold">Monthly Expenses</h3>
              <span className="text-sm font-bold">${grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Toggle optional items on or off.</p>
          </div>

          {/* Mandatory */}
          <div className="px-4 pb-2">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mandatory</span>
              <span className="text-[10px] font-semibold text-muted-foreground">${mandatoryTotal.toFixed(2)}</span>
            </div>
            <div className="space-y-0.5">
              {expenses.filter(e => e.mandatory).map(expense => {
                const Icon = expense.icon;
                return (
                  <div key={expense.id} className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="flex-1 text-xs font-medium">{expense.label}</span>
                    <span className="text-xs font-semibold">${expense.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-1.5 px-1 mt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Optional</span>
              <span className="text-[10px] font-semibold text-muted-foreground">${optionalTotal.toFixed(2)}</span>
            </div>
            <div className="space-y-0.5">
              {expenses.filter(e => !e.mandatory).map(expense => {
                const Icon = expense.icon;
                const isOn = !optionalOff.has(expense.id);
                return (
                  <div
                    key={expense.id}
                    onClick={() => toggleOptional(expense.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-1 py-1.5 rounded-lg cursor-pointer select-none transition-smooth",
                      isOn ? "hover:bg-muted/50" : "opacity-40 hover:opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-smooth",
                      isOn ? "bg-violet-50 dark:bg-violet-950/30 text-violet-600" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={cn("flex-1 text-xs transition-smooth", isOn ? "font-medium" : "line-through text-muted-foreground")}>
                      {expense.label}
                    </span>
                    <span className="text-xs font-semibold mr-1.5">${expense.amount.toFixed(2)}</span>
                    <div className={cn(
                      "w-8 h-4 rounded-full flex items-center px-0.5 transition-colors duration-200 shrink-0",
                      isOn ? "bg-primary justify-end" : "bg-muted justify-start"
                    )}>
                      <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini summary bar */}
            <div className="mt-4 px-1">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden flex gap-px">
                <div
                  className="h-full bg-blue-500 rounded-l-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (mandatoryTotal / (grandTotal || 1)) * 100)}%` }}
                />
                <div
                  className="h-full bg-violet-500 rounded-r-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (optionalTotal / (grandTotal || 1)) * 100)}%` }}
                />
              </div>
              <div className="flex gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Mandatory
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Optional
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right pane: bill detail ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {viewedBill ? (
          <div className="p-8 max-w-2xl">
            <div className="rounded-2xl border border-border bg-card shadow-card-soft overflow-hidden mb-5">
              {/* Bill header */}
              <div className="px-6 py-5 border-b border-border/60 flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  viewedStatus === "paid"     ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                  viewedStatus === "due"      ? "bg-red-100 dark:bg-red-900/30 text-red-600" :
                                               "bg-muted text-muted-foreground"
                )}>
                  {(() => { const Icon = billIcon(viewedBill); return <Icon className="w-6 h-6" />; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base">{viewedBill.sender}</div>
                  <div className="text-sm text-muted-foreground">{viewedBill.subject}</div>
                </div>
                {viewedStatus === "paid" ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 font-semibold border border-green-200 dark:border-green-800 flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                  </span>
                ) : viewedStatus === "due" ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 font-semibold border border-red-200 dark:border-red-800 flex items-center gap-1.5 shrink-0">
                    <AlertCircle className="w-3.5 h-3.5" /> Due Now
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-semibold border border-border flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5" /> Day {viewedBill.scheduledDay}
                  </span>
                )}
              </div>

              <div className="px-6 py-5">
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 flex gap-3 mb-6">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300 leading-snug">
                    {viewedBill.description}
                  </p>
                </div>

                {isActiveBill && viewedStatus === "due" ? (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                      What do you do?
                    </h4>
                    <div className="space-y-2">
                      {viewedBill.choices.map(c => (
                        <button
                          key={c.index}
                          disabled={submitting}
                          onClick={() => handleAnswer(c.index)}
                          className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-smooth disabled:opacity-50 group"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                              {String.fromCharCode(65 + c.index)}
                            </span>
                            <span className="text-sm leading-snug">{c.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {viewedStatus === "paid"
                      ? "This bill has already been handled."
                      : "This bill hasn't arrived yet."}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 border border-border/50 px-4 py-3 flex gap-3">
              <Receipt className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Tip: </span>
                Always pay recurring bills before discretionary purchases. A missed bill compounds into late fees, service cuts, and credit damage.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Select a bill to view details.
          </div>
        )}
      </div>

      {result && <ResultModal result={result} onContinue={() => setResult(null)} />}
    </div>
  );
}
