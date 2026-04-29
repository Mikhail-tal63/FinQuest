import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { api, User, Scenario, Persona, resetMockProgress } from "@/lib/api";

export type WindowKey = "persona" | "inbox" | "wallet" | "profile" | "final";

interface Ctx {
  user: User | null;
  sessionId: string | null;
  currentScenario: Scenario | null;
  activeWindow: WindowKey;
  loading: boolean;
  remainingScenarios: number;
  setActiveWindow: (w: WindowKey) => void;
  selectPersona: (p: Persona) => Promise<void>;
  refreshUser: () => Promise<void>;
  loadCurrentScenario: () => Promise<Scenario | null>;
  setCurrentScenario: (s: Scenario | null) => void;
  setRemainingScenarios: (n: number) => void;
}

const FinQuestContext = createContext<Ctx | undefined>(undefined);

export function FinQuestProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [activeWindow, setActiveWindow] = useState<WindowKey>("persona");
  const [loading, setLoading] = useState(false);
  const [remainingScenarios, setRemainingScenarios] = useState(0);

  const selectPersona = useCallback(async (persona: Persona) => {
    setLoading(true);
    try {
      resetMockProgress();
      const u = await api.createUser(persona);
      setUser(u);
      const s = await api.startSession(u.id);
      setSessionId(s.sessionId);
      const sc = await api.getCurrentScenario(s.sessionId);
      setCurrentScenario(sc);
      setActiveWindow("inbox");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const u = await api.getUser(user.id);
    setUser(u);
  }, [user]);

  const loadCurrentScenario = useCallback(async () => {
    if (!sessionId) return null;
    const sc = await api.getCurrentScenario(sessionId);
    setCurrentScenario(sc);
    return sc;
  }, [sessionId]);

  return (
    <FinQuestContext.Provider
      value={{
        user,
        sessionId,
        currentScenario,
        activeWindow,
        loading,
        remainingScenarios,
        setActiveWindow,
        selectPersona,
        refreshUser,
        loadCurrentScenario,
        setCurrentScenario,
        setRemainingScenarios,
      }}
    >
      {children}
    </FinQuestContext.Provider>
  );
}

export function useFinQuest() {
  const ctx = useContext(FinQuestContext);
  if (!ctx) throw new Error("useFinQuest must be used within FinQuestProvider");
  return ctx;
}
