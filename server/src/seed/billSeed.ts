import mongoose from 'mongoose';
import Bill from '../models/Bill';

/**
 * Creates sample bills tied to a given userId.
 * Call this after seeding a demo user.
 */
export const seedBills = async (userId: mongoose.Types.ObjectId): Promise<void> => {
  await Bill.deleteMany({ userId });

  const now = new Date();
  const bills = [
    {
      userId,
      title: 'Internet',
      amount: 50,
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
      status: 'due' as const,
      category: 'Utilities',
    },
    {
      userId,
      title: 'Electricity',
      amount: 80,
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
      status: 'due' as const,
      category: 'Utilities',
    },
    {
      userId,
      title: 'Rent',
      amount: 500,
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12),
      status: 'due' as const,
      category: 'Housing',
    },
    {
      userId,
      title: 'University Fees',
      amount: 300,
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
      status: 'overdue' as const,
      category: 'Education',
    },
    {
      userId,
      title: 'Design Tool Subscription',
      amount: 20,
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      status: 'due' as const,
      category: 'Software',
    },
  ];

  await Bill.insertMany(bills);
  console.log(`✅  Seeded ${bills.length} bills for user ${userId}`);
};
