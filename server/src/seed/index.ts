import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import User from '../models/User';
import { Badge } from '../models/Badge';
import { seedScenarios } from './scenarioSeed';
import { seedBills } from './billSeed';
import { seedTransactions } from './transactionSeed';

const badgeSeedData = [
  {
    name: 'Security Starter',
    description: 'Reached a security score of 60',
    icon: '🛡️',
    conditionType: 'security',
    requiredScore: 60,
  },
  {
    name: 'Awareness Achiever',
    description: 'Reached an awareness score of 70',
    icon: '🧠',
    conditionType: 'awareness',
    requiredScore: 70,
  },
  {
    name: 'Savings Hero',
    description: 'Accumulated 200 in savings progress',
    icon: '💰',
    conditionType: 'savings',
    requiredScore: 200,
  },
  {
    name: 'Scenario Explorer',
    description: 'Completed 5 scenarios',
    icon: '🗺️',
    conditionType: 'scenarios_completed',
    requiredScore: 5,
  },
  {
    name: 'Financial Master',
    description: 'Completed all 10 scenarios',
    icon: '🏆',
    conditionType: 'scenarios_completed',
    requiredScore: 10,
  },
];

const run = async () => {
  await connectDB();

  console.log('🌱 Starting seed...');

  // Seed scenarios
  await seedScenarios();

  // Seed badges
  await Badge.deleteMany({});
  await Badge.insertMany(badgeSeedData);
  console.log(`✅  Seeded ${badgeSeedData.length} badges`);

  // Create a demo user per role
  await User.deleteMany({});
  const demoUsers = [
    { name: 'Alex (Student)', role: 'student' as const, balance: 1200, awarenessScore: 50, securityScore: 50 },
    { name: 'Sam (Employee)', role: 'employee' as const, balance: 2500, awarenessScore: 50, securityScore: 50 },
    { name: 'Jordan (Freelancer)', role: 'freelancer' as const, balance: 1800, awarenessScore: 50, securityScore: 50 },
  ];

  for (const userData of demoUsers) {
    const user = await User.create(userData);
    await seedBills(user._id as mongoose.Types.ObjectId);
    await seedTransactions(user._id as mongoose.Types.ObjectId);
    console.log(`✅  Demo user created: ${user.name} (${user._id})`);
  }

  console.log('🎉 Seed complete!');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
