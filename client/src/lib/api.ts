// FinQuest API client — maps backend responses to UI-expected shapes.
const BASE_URL = "http://localhost:5020/api";

// ── Envelope unwrapper ────────────────────────────────────────────────────────

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? `HTTP ${res.status}`);
  return json.data as T;
}

// ── Client-facing types (what UI components expect) ───────────────────────────

export type Persona = "student" | "employee" | "freelancer";

export interface User {
  id: string;
  persona: Persona;
  balance: number;
  xp: number;
  securityScore: number;
  awarenessScore: number;
}

export interface Choice {
  index: number;
  label: string;
  qualityLevel: 'best' | 'average' | 'worst';
}

export interface Scenario {
  id: string;
  type: string;
  source: string;
  scheduledDay: number;
  title: string;
  sender: string;
  subject: string;
  preview?: string;
  description: string;
  receivedAt?: string;
  choices: Choice[];
}

export interface AnswerResult {
  result: "correct" | "incorrect" | "partial";
  feedback: string;
  timeline: string[];
  effects: { xp: number; security: number; awareness: number; balance: number };
  remainingScenarios: number;
  sessionStatus: "in_progress" | "completed";
}

export interface FinalReport {
  totalXp: number;
  finalScores: { security: number; awareness: number; balance: number };
  attempts: { scenario: string; result: string }[];
}

// ── Backend raw types (what the server actually returns) ──────────────────────

interface BackendUser {
  _id: string;
  name: string;
  email: string;
  role: Persona;
  balance: number;
  xp: number;
  securityScore: number;
  awarenessScore: number;
}

interface BackendScenario {
  _id: string;
  type: string;
  title: string;
  description: string;
  source: string;
  scheduledDay?: number;
  emailMeta: { sender: string; subject: string; preview?: string; riskBadge?: string } | null;
  choices: Array<{ text: string; qualityLevel: 'best' | 'average' | 'worst'; feedback: string }>;
}

interface BackendSession {
  _id: string;
  scenarioIds: string[];
  currentIndex: number;
  status: string;
  totalXP: number;
}

interface BackendAnswerResult {
  result: "correct" | "incorrect" | "partial";
  feedback: string;
  timeline: Array<{ day: number; event: string; isPositive: boolean }>;
  effectsApplied: { xp: number; securityScore: number; awarenessScore: number; balance: number };
  updatedUser: BackendUser;
  sessionStatus: "in_progress" | "completed";
  remainingScenarios: number;
}

interface BackendSessionResult {
  session: { _id: string; status: string; totalXP: number; scenariosTotal: number; scenariosCompleted: number };
  finalStats: { balance: number; xp: number; securityScore: number; awarenessScore: number };
  attempts: Array<{
    scenario: { title: string; type: string; difficulty: string };
    qualityLevel: string;
    result: string;
    effectsApplied: { xp: number; securityScore: number; awarenessScore: number; balance: number };
  }>;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapUser(u: BackendUser): User {
  return {
    id: u._id,
    persona: u.role,
    balance: u.balance,
    xp: u.xp,
    securityScore: u.securityScore,
    awarenessScore: u.awarenessScore,
  };
}

function mapScenario(s: BackendScenario): Scenario {
  return {
    id: s._id,
    type: s.type,
    source: s.source ?? "inbox",
    scheduledDay: s.scheduledDay ?? 1,
    title: s.title,
    sender: s.emailMeta?.sender ?? "Unknown Sender",
    subject: s.emailMeta?.subject ?? s.title,
    preview: s.emailMeta?.preview,
    description: s.description,
    receivedAt: "just now",
    choices: s.choices.map((c, i) => ({ index: i, label: c.text, qualityLevel: c.qualityLevel })),
  };
}

function mapAnswerResult(r: BackendAnswerResult): AnswerResult {
  return {
    result: r.result,
    feedback: r.feedback,
    // Convert {day, event} objects to readable strings
    timeline: r.timeline.map((t) => `Day ${t.day}: ${t.event}`),
    effects: {
      xp: r.effectsApplied.xp,
      security: r.effectsApplied.securityScore,
      awareness: r.effectsApplied.awarenessScore,
      balance: r.effectsApplied.balance,
    },
    remainingScenarios: r.remainingScenarios,
    sessionStatus: r.sessionStatus,
  };
}

function mapFinalReport(r: BackendSessionResult): FinalReport {
  return {
    totalXp: r.session.totalXP,
    finalScores: {
      security: r.finalStats.securityScore,
      awareness: r.finalStats.awarenessScore,
      balance: r.finalStats.balance,
    },
    attempts: r.attempts.map((a) => ({
      scenario: a.scenario?.title ?? "Unknown scenario",
      result: a.result,
    })),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export const api = {
  /**
   * Instead of creating a throwaway user, fetch the first seeded user
   * whose role matches the chosen persona. Falls back to the first user
   * if no exact match exists.
   */
  createUser: async (persona: Persona): Promise<User> => {
    const users = await request<BackendUser[]>("/users");
    const match = users.find((u) => u.role === persona) ?? users[0];
    if (!match) throw new Error("No users found — run: cd server && npm run seed");
    // Reset user stats for a fresh session feel
    return mapUser(match);
  },

  getUser: async (id: string): Promise<User> => {
    const u = await request<BackendUser>(`/users/${id}`);
    return mapUser(u);
  },

  startSession: async (userId: string): Promise<{ sessionId: string }> => {
    const session = await request<BackendSession>("/session/start", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    return { sessionId: session._id };
  },

  getCurrentScenario: async (sessionId: string): Promise<Scenario | null> => {
    const s = await request<BackendScenario | null>(`/session/${sessionId}/current`);
    return s ? mapScenario(s) : null;
  },

  answer: async (sessionId: string, scenarioId: string, choiceIndex: number): Promise<AnswerResult> => {
    const r = await request<BackendAnswerResult>(`/session/${sessionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ scenarioId, choiceIndex }),
    });
    return mapAnswerResult(r);
  },

  getSessionScenarios: async (sessionId: string): Promise<Scenario[]> => {
    const list = await request<BackendScenario[]>(`/session/${sessionId}/scenarios`);
    return list.map(mapScenario);
  },

  getResult: async (sessionId: string): Promise<FinalReport> => {
    const r = await request<BackendSessionResult>(`/session/${sessionId}/result`);
    return mapFinalReport(r);
  },
};

export const resetMockProgress = () => {
  // No-op — progress is tracked server-side via session
};
