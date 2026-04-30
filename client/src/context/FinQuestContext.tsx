import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from "react";
import { api, User, Scenario, Persona, AnswerResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  label: string;
  sublabel: string;
  amount: number;
  type: 'debit' | 'credit' | 'freeze';
}

export type WindowKey = "persona" | "inbox" | "wallet" | "notifications" | "bills" | "profile" | "final";

// 1 real minute = 1 game day  (adjust here to speed up / slow down)
const MS_PER_GAME_DAY = 60 * 1000;
const MS_PER_GAME_HOUR = Math.floor(MS_PER_GAME_DAY / 24);

const MONTHLY_SALARY: Record<Persona, number> = {
  student: 1200,
  employee: 3500,
  freelancer: 2800,
};

// ── Context interface ────────────────────────────────────────────────────────

interface Ctx {
  user: User | null;
  sessionId: string | null;
  allScenarios: Scenario[];
  answeredIds: Set<string>;
  gameDay: number;
  gameHour: number;
  salary: number;
  transactions: Transaction[];
  accountFrozen: boolean;
  optionalOff: Set<string>;
  activeWindow: WindowKey;
  loading: boolean;
  setActiveWindow: (w: WindowKey) => void;
  selectPersona: (p: Persona) => Promise<void>;
  refreshUser: () => Promise<void>;
  answerScenario: (scenarioId: string, choiceIndex: number) => Promise<AnswerResult>;
  addTransaction: (tx: Transaction) => void;
  freezeAccount: () => void;
  toggleOptional: (id: string) => void;
}

const FinQuestContext = createContext<Ctx | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

export function FinQuestProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [allScenarios, setAllScenarios] = useState<Scenario[]>([]);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [gameDay, setGameDay] = useState(1);
  const [gameHour, setGameHour] = useState(0);
  const [salary, setSalary] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountFrozen, setAccountFrozen] = useState(false);
  const [optionalOff, setOptionalOff] = useState<Set<string>>(new Set());
  const [activeWindow, setActiveWindow] = useState<WindowKey>("persona");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const allScenariosRef = useRef(allScenarios);
  allScenariosRef.current = allScenarios;

  // ── Game clock ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!sessionId) return;

    const tick = setInterval(() => {
      setGameHour(h => {
        if (h >= 23) {
          setGameDay(d => d + 1);
          return 0;
        }
        return h + 1;
      });
    }, MS_PER_GAME_HOUR);

    return () => clearInterval(tick);
  }, [sessionId]);

  // Month-end trigger
  useEffect(() => {
    if (gameDay > 30 && sessionId) {
      setActiveWindow("final");
    }
  }, [gameDay, sessionId]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const selectPersona = useCallback(async (persona: Persona) => {
    setLoading(true);
    try {
      const u = await api.createUser(persona);
      setUser(u);
      const s = await api.startSession(u.id);
      setSessionId(s.sessionId);
      const all = await api.getSessionScenarios(s.sessionId);
      setAllScenarios(all);
      setSalary(MONTHLY_SALARY[persona]);
      setAnsweredIds(new Set());
      setGameDay(1);
      setGameHour(0);
      setTransactions([]);
      setAccountFrozen(false);
      setOptionalOff(new Set());
      setActiveWindow("inbox");
    } catch (err) {
      toast({
        title: "Failed to start session",
        description: err instanceof Error ? err.message : "Could not connect to server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const u = await api.getUser(user.id);
    setUser(u);
  }, [user]);

  const answerScenario = useCallback(async (scenarioId: string, choiceIndex: number): Promise<AnswerResult> => {
    if (!sessionId) throw new Error("No active session");

    const r = await api.answer(sessionId, scenarioId, choiceIndex);

    setAnsweredIds(prev => new Set([...prev, scenarioId]));

    if (r.effects.balance !== 0) {
      const scenario = allScenariosRef.current.find(s => s.id === scenarioId);
      if (scenario) {
        setTransactions(prev => [{
          id: scenarioId + "_" + Date.now(),
          label: scenario.sender,
          sublabel: scenario.subject,
          amount: r.effects.balance,
          type: r.effects.balance < 0 ? "debit" : "credit",
        }, ...prev]);
      }
    }

    const u = await api.getUser(r.updatedUser?.id ?? user!.id);
    setUser(u);

    return r;
  }, [sessionId, user]);

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const freezeAccount = useCallback(() => {
    setAccountFrozen(true);
    setTransactions(prev => [{
      id: "freeze_" + Date.now(),
      label: "Security Action",
      sublabel: "Account temporarily frozen by you",
      amount: 0,
      type: "freeze" as const,
    }, ...prev]);
  }, []);

  const toggleOptional = useCallback((id: string) => {
    setOptionalOff(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <FinQuestContext.Provider value={{
      user,
      sessionId,
      allScenarios,
      answeredIds,
      gameDay,
      gameHour,
      salary,
      transactions,
      accountFrozen,
      optionalOff,
      activeWindow,
      loading,
      setActiveWindow,
      selectPersona,
      refreshUser,
      answerScenario,
      addTransaction,
      freezeAccount,
      toggleOptional,
    }}>
      {children}
    </FinQuestContext.Provider>
  );
}

export function useFinQuest() {
  const ctx = useContext(FinQuestContext);
  if (!ctx) throw new Error("useFinQuest must be used within FinQuestProvider");
  return ctx;
}
