import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '../../.env') })

import mongoose from 'mongoose'
import User from '../models/User'
import Scenario from '../models/Scenario'
import Session from '../models/Session'
import Attempt from '../models/Attempt'
import scenarios from './scenariosData'
import { Persona } from '../types'

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/finquest'

interface DemoUser {
  name: string
  email: string
  role: Persona
  balance: number
  xp: number
  securityScore: number
  awarenessScore: number
}

const demoUsers: DemoUser[] = [
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@demo.com',
    role: 'employee',
    balance: 5000,
    xp: 0,
    securityScore: 50,
    awarenessScore: 50,
  },
  {
    name: 'Sam Rivera',
    email: 'sam.rivera@demo.com',
    role: 'student',
    balance: 1500,
    xp: 0,
    securityScore: 40,
    awarenessScore: 45,
  },
  {
    name: 'Jordan Lee',
    email: 'jordan.lee@demo.com',
    role: 'freelancer',
    balance: 3200,
    xp: 0,
    securityScore: 55,
    awarenessScore: 60,
  },
]

async function seed(): Promise<void> {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB:', MONGO_URI)

  // Wipe existing data
  await Promise.all([
    User.deleteMany({}),
    Scenario.deleteMany({}),
    Session.deleteMany({}),
    Attempt.deleteMany({}),
  ])
  console.log('Cleared existing data.')

  const createdUsers = await User.insertMany(demoUsers)
  const createdScenarios = await Scenario.insertMany(scenarios)

  console.log(`Seeded ${createdUsers.length} users:`)
  createdUsers.forEach(u => console.log(`  [${u.role}] ${u.name} — _id: ${u._id}`))

  console.log(`\nSeeded ${createdScenarios.length} scenarios:`)
  createdScenarios.forEach(s => console.log(`  [${s.type}] ${s.title}`))

  await mongoose.disconnect()
  console.log('\nSeed complete. Database is ready.')
}

seed().catch((err: Error) => {
  console.error('Seed error:', err.message)
  process.exit(1)
})
