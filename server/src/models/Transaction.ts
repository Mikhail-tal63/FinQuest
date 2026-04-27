import mongoose, { Schema, Document, Model } from 'mongoose';

// ─────────────────────────────────────────────
// Interface
// ─────────────────────────────────────────────
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const TransactionSchema = new Schema<ITransaction>(
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
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// Model
// ─────────────────────────────────────────────
const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema
);

export default Transaction;
