import mongoose, { Document, Schema } from 'mongoose'
import { QualityLevel, ScenarioType, ScenarioSource, Difficulty, Persona, Effects, TimelineEvent } from '../types'

export interface ITimelineEvent extends TimelineEvent {}

export interface IChoiceEffects extends Partial<Effects> {}

export interface IChoice {
  text: string
  qualityLevel: QualityLevel
  feedback: string
  timeline: ITimelineEvent[]
  effects: IChoiceEffects
}

export interface IEmailMeta {
  sender?: string
  subject?: string
  preview?: string
  riskBadge?: string
}

export interface IScenario extends Document {
  title: string
  description: string
  type: ScenarioType
  source: ScenarioSource
  scheduledDay: number
  emailMeta: IEmailMeta
  realContext?: string
  choices: IChoice[]
  difficulty: Difficulty
  targetRoles: Persona[]
  createdAt: Date
  updatedAt: Date
}

const timelineEventSchema = new Schema<ITimelineEvent>(
  {
    day: { type: Number, required: true },
    event: { type: String, required: true },
    isPositive: { type: Boolean, required: true },
  },
  { _id: false }
)

const choiceEffectsSchema = new Schema<IChoiceEffects>(
  {
    xp: { type: Number, default: 0 },
    securityScore: { type: Number, default: 0 },
    awarenessScore: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { _id: false }
)

const choiceSchema = new Schema<IChoice>(
  {
    text: { type: String, required: true },
    qualityLevel: {
      type: String,
      enum: ['best', 'average', 'worst'],
      required: true,
    },
    feedback: { type: String, required: true },
    timeline: [timelineEventSchema],
    effects: { type: choiceEffectsSchema, default: () => ({}) },
  },
  { _id: false }
)

const scenarioSchema = new Schema<IScenario>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'phishing_bank',
        'phishing_grant',
        'salary_update',
        'investment_scam',
        'tax_refund',
        'account_verification',
        'prize_notification',
      ],
      required: true,
    },
    source: { type: String, enum: ['inbox'], default: 'inbox' },
    scheduledDay: { type: Number, default: 1, min: 1 },
    emailMeta: {
      sender: { type: String },
      subject: { type: String },
      preview: { type: String },
      riskBadge: { type: String },
    },
    realContext: { type: String },
    choices: {
      type: [choiceSchema],
      validate: (v: IChoice[]) => v.length >= 2,
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    targetRoles: {
      type: [String],
      enum: ['student', 'employee', 'freelancer'],
      default: ['student', 'employee', 'freelancer'],
    },
  },
  { timestamps: true }
)

export const Scenario = mongoose.model<IScenario>('Scenario', scenarioSchema)
export default Scenario
