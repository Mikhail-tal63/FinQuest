export type Persona = 'student' | 'employee' | 'freelancer'
export type QualityLevel = 'best' | 'average' | 'worst'
export type ScenarioType =
  | 'phishing_bank'
  | 'phishing_grant'
  | 'salary_update'
  | 'investment_scam'
  | 'tax_refund'
  | 'account_verification'
  | 'prize_notification'
export type ScenarioSource = 'inbox'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type SessionStatus = 'active' | 'completed'

export interface Effects {
  xp: number
  securityScore: number
  awarenessScore: number
  balance: number
}

export interface TimelineEvent {
  day: number
  event: string
  isPositive: boolean
}

export interface EvaluateChoiceResult {
  qualityLevel: QualityLevel
  result: 'correct' | 'partial' | 'incorrect'
  effects: Partial<Effects>
  timeline: TimelineEvent[]
  feedback: string
}
