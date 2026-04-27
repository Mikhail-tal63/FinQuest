import mongoose, { Schema, Document, Model } from 'mongoose';

// ─────────────────────────────────────────────
// Sub-Interfaces
// ─────────────────────────────────────────────
export interface IChoiceEffects {
  balance: number;
  awareness: number;
  security: number;
  savings: number;
}

export interface IChoice {
  text: string;
  isCorrect: boolean;
  effects: IChoiceEffects;
  feedback: string;
}

// ─────────────────────────────────────────────
// Interface
// ─────────────────────────────────────────────
export interface IScenario extends Document {
  title: string;
  role: 'student' | 'employee' | 'freelancer' | 'all';
  source: 'inbox' | 'wallet' | 'bills' | 'tasks' | 'phone' | 'savings';
  category: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  choices: IChoice[];
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Sub-Schemas
// ─────────────────────────────────────────────
const ChoiceEffectsSchema = new Schema<IChoiceEffects>(
  {
    balance: { type: Number, default: 0 },
    awareness: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
  },
  { _id: false }
);

const ChoiceSchema = new Schema<IChoice>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    effects: { type: ChoiceEffectsSchema, required: true },
    feedback: { type: String, required: true },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const ScenarioSchema = new Schema<IScenario>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'employee', 'freelancer', 'all'],
      required: [true, 'Role is required'],
    },
    source: {
      type: String,
      enum: ['inbox', 'wallet', 'bills', 'tasks', 'phone', 'savings'],
      required: [true, 'Source is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    choices: {
      type: [ChoiceSchema],
      validate: {
        validator: (v: IChoice[]) => v.length >= 2 && v.length <= 4,
        message: 'A scenario must have between 2 and 4 choices',
      },
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// Model
// ─────────────────────────────────────────────
const Scenario: Model<IScenario> = mongoose.model<IScenario>('Scenario', ScenarioSchema);

export default Scenario;
