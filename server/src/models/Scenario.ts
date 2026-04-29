import mongoose, { Schema, Document, Model } from 'mongoose';

// ── Sub-types ────────────────────────────────────────────────────────────────

export interface IChoiceEffects {
  balance: number;
  awareness: number;
  security: number;
  savings: number;
}

export interface ITimelineEvent {
  day: number;
  event: string;
  isPositive: boolean;
}

export interface IChoice {
  text: string;
  qualityLevel: 'best' | 'average' | 'worst';
  effects: IChoiceEffects;
  feedback: string;
  mistakeTag?: string;         // recorded in User.mistakeTags when qualityLevel = 'worst'
  timeline: ITimelineEvent[];  // consequence steps shown after this choice
}

export interface IClue {
  label: string;
  description: string;
}

export interface IReasonOption {
  text: string;
  isCorrect: boolean;
}

// ── Main interface ───────────────────────────────────────────────────────────

export interface IScenario extends Document {
  title: string;
  role: 'student' | 'employee' | 'freelancer' | 'all';
  source: 'inbox' | 'wallet' | 'bills' | 'tasks' | 'phone' | 'savings';
  category: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  riskPoints: number;           // how much Risk Radar increases when this scenario is opened
  // Inspect Message feature
  clues: IClue[];
  // Before You Click feature
  preClickChecklist: string[];
  // What Would You Lose feature
  potentialLosses: string[];
  // Reason Behind Decision feature
  reasonQuestion: string;
  reasonOptions: IReasonOption[];
  // Choices (3: worst / average / best)
  choices: IChoice[];
  // Email-specific metadata (for Inbox panel display)
  emailMeta?: {
    sender: string;
    subject: string;
    preview: string;
    riskBadge: 'safe' | 'warning' | 'suspicious';
  };
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const EffectsSchema = new Schema<IChoiceEffects>(
  { balance: { type: Number, default: 0 }, awareness: { type: Number, default: 0 }, security: { type: Number, default: 0 }, savings: { type: Number, default: 0 } },
  { _id: false }
);

const TimelineEventSchema = new Schema<ITimelineEvent>(
  { day: { type: Number, required: true }, event: { type: String, required: true }, isPositive: { type: Boolean, required: true } },
  { _id: false }
);

const ChoiceSchema = new Schema<IChoice>(
  {
    text: { type: String, required: true },
    qualityLevel: { type: String, enum: ['best', 'average', 'worst'], required: true },
    effects: { type: EffectsSchema, required: true },
    feedback: { type: String, required: true },
    mistakeTag: { type: String },
    timeline: { type: [TimelineEventSchema], default: [] },
  },
  { _id: false }
);

const ClueSchema = new Schema<IClue>(
  { label: { type: String, required: true }, description: { type: String, required: true } },
  { _id: false }
);

const ReasonOptionSchema = new Schema<IReasonOption>(
  { text: { type: String, required: true }, isCorrect: { type: Boolean, required: true } },
  { _id: false }
);

// ── Main schema ──────────────────────────────────────────────────────────────

const ScenarioSchema = new Schema<IScenario>(
  {
    title: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'employee', 'freelancer', 'all'], required: true },
    source: { type: String, enum: ['inbox', 'wallet', 'bills', 'tasks', 'phone', 'savings'], required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    riskPoints: { type: Number, default: 10 },
    clues: { type: [ClueSchema], default: [] },
    preClickChecklist: [{ type: String }],
    potentialLosses: [{ type: String }],
    reasonQuestion: { type: String, default: 'Why is this the best decision?' },
    reasonOptions: { type: [ReasonOptionSchema], default: [] },
    choices: {
      type: [ChoiceSchema],
      validate: { validator: (v: IChoice[]) => v.length >= 2 && v.length <= 3, message: 'Must have 2-3 choices' },
    },
    emailMeta: {
      type: new Schema(
        { sender: String, subject: String, preview: String, riskBadge: { type: String, enum: ['safe', 'warning', 'suspicious'] } },
        { _id: false }
      ),
      default: null,
    },
  },
  { timestamps: true }
);

const Scenario: Model<IScenario> = mongoose.model<IScenario>('Scenario', ScenarioSchema);
export default Scenario;
