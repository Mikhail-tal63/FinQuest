require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')
const Scenario = require('../models/Scenario')
const Session = require('../models/Session')
const Attempt = require('../models/Attempt')
const scenarios = require('./scenariosData')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finquest'

const demoUsers = [
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

async function seed() {
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

seed().catch(err => {
  console.error('Seed error:', err.message)
  process.exit(1)
})
