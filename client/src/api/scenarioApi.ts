const BASE = '/api'

export interface TimelineEvent {
  day: number
  event: string
  isPositive: boolean
}

export interface ScenarioChoice {
  text: string
  qualityLevel: 'best' | 'average' | 'worst'
  feedback: string
  timeline: TimelineEvent[]
}

export interface Scenario {
  _id: string
  title: string
  description: string
  emailMeta: {
    sender: string
    subject: string
    preview: string
    riskBadge: string
  } | null
  choices: ScenarioChoice[]
}

export interface AnswerResult {
  timeline: TimelineEvent[]
  updatedUser: { _id: string; balance: number; xp: number }
}

export async function fetchInboxScenario(): Promise<Scenario | null> {
  const res = await fetch(`${BASE}/scenarios?source=inbox`)
  const json = await res.json()
  if (!json.success || !json.data.length) return null
  return json.data[0] as Scenario
}

export async function fetchDemoUser(): Promise<string | null> {
  const res = await fetch(`${BASE}/users`)
  const json = await res.json()
  if (!json.success || !json.data.length) return null
  return json.data[0]._id as string
}

export async function submitAnswer(
  userId: string,
  scenarioId: string,
  choiceIndex: number
): Promise<AnswerResult> {
  const res = await fetch(`${BASE}/scenarios/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, scenarioId, choiceIndex }),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? 'Failed')
  return json.data as AnswerResult
}
