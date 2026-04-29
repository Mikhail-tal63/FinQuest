import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import User from '../models/User';
import { Badge } from '../models/Badge';
import { seedScenarios } from './scenarioSeed';
import { seedBills } from './billSeed';
import { seedTransactions } from './transactionSeed';

const badgeSeedData = [
  { name: 'Security Starter',    description: 'Reached a security score of 60',     icon: '🛡️',  conditionType: 'security',             requiredScore: 60  },
  { name: 'Awareness Achiever',  description: 'Reached an awareness score of 70',   icon: '🧠',  conditionType: 'awareness',            requiredScore: 70  },
  { name: 'Savings Hero',        description: 'Accumulated 200 in savings progress', icon: '💰',  conditionType: 'savings',              requiredScore: 200 },
  { name: 'Scenario Explorer',   description: 'Completed 5 scenarios',              icon: '🗺️',  conditionType: 'scenarios_completed',  requiredScore: 5   },
  { name: 'Financial Master',    description: 'Completed all 10 scenarios',         icon: '🏆',  conditionType: 'scenarios_completed',  requiredScore: 10  },
  { name: 'XP Grinder',          description: 'Earned 150 XP',                      icon: '⚡',  conditionType: 'xp',                   requiredScore: 150 },
  { name: 'Low Risk Champion',   description: 'Kept risk level at or below 20',     icon: '✅',  conditionType: 'risk_low',             requiredScore: 20  },
];

const run = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  await seedScenarios();

  await Badge.deleteMany({});
  await Badge.insertMany(badgeSeedData);
  console.log(`✅  Seeded ${badgeSeedData.length} badges`);

  await User.deleteMany({});
  const demoRoles: Array<{ name: string; role: 'student' | 'employee' | 'freelancer'; balance: number }> = [
    { name: 'Alex', role: 'student',    balance: 1200 },
    { name: 'Sam',  role: 'employee',   balance: 2500 },
    { name: 'Jordan', role: 'freelancer', balance: 1800 },
  ];

  for (const userData of demoRoles) {
    const user = await User.create({ ...userData, awarenessScore: 50, securityScore: 50 });
    await seedBills(user._id as mongoose.Types.ObjectId);
    await seedTransactions(user._id as mongoose.Types.ObjectId);
    console.log(`✅  Demo user: ${user.name} (${user.role}) — id: ${user._id}`);
  }

  console.log('🎉 Seed complete!');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
