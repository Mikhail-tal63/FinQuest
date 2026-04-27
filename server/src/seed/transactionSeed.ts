import mongoose from 'mongoose';
import Transaction from '../models/Transaction';

/**
 * Seeds a realistic transaction history for a given user.
 */
export const seedTransactions = async (userId: mongoose.Types.ObjectId): Promise<void> => {
  await Transaction.deleteMany({ userId });

  const now = new Date();
  const daysAgo = (d: number) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - d);

  const transactions = [
    {
      userId,
      title: 'Monthly Salary',
      amount: 1500,
      type: 'income' as const,
      category: 'Salary',
      date: daysAgo(30),
    },
    {
      userId,
      title: 'Grocery Shopping',
      amount: 120,
      type: 'expense' as const,
      category: 'Food',
      date: daysAgo(25),
    },
    {
      userId,
      title: 'Freelance Project Payment',
      amount: 400,
      type: 'income' as const,
      category: 'Freelance',
      date: daysAgo(20),
    },
    {
      userId,
      title: 'Netflix Subscription',
      amount: 15,
      type: 'expense' as const,
      category: 'Entertainment',
      date: daysAgo(18),
    },
    {
      userId,
      title: 'Phone Bill',
      amount: 35,
      type: 'expense' as const,
      category: 'Utilities',
      date: daysAgo(15),
    },
    {
      userId,
      title: 'Savings Deposit',
      amount: 200,
      type: 'expense' as const,
      category: 'Savings',
      date: daysAgo(10),
    },
    {
      userId,
      title: 'Dining Out',
      amount: 60,
      type: 'expense' as const,
      category: 'Food',
      date: daysAgo(5),
    },
    {
      userId,
      title: 'Book Purchase',
      amount: 25,
      type: 'expense' as const,
      category: 'Education',
      date: daysAgo(2),
    },
  ];

  await Transaction.insertMany(transactions);
  console.log(`✅  Seeded ${transactions.length} transactions for user ${userId}`);
};
