import mongoose, { Schema, Document, Model } from 'mongoose';

// ─────────────────────────────────────────────
// Interface
// ─────────────────────────────────────────────
export interface IBill extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'due' | 'overdue';
  category: string;
  linkedScenarioId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const BillSchema = new Schema<IBill>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['paid', 'due', 'overdue'],
      default: 'due',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    linkedScenarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Scenario',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// Model
// ─────────────────────────────────────────────
const Bill: Model<IBill> = mongoose.model<IBill>('Bill', BillSchema);

export default Bill;
