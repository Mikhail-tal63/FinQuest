const mongoose = require('mongoose')

const timelineEventSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    event: { type: String, required: true },
    isPositive: { type: Boolean, required: true },
  },
  { _id: false }
)

const choiceEffectsSchema = new mongoose.Schema(
  {
    xp: { type: Number, default: 0 },
    securityScore: { type: Number, default: 0 },
    awarenessScore: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { _id: false }
)

const choiceSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    qualityLevel: {
      type: String,
      enum: ['best', 'average', 'worst'],
      required: true,
    },
    feedback: { type: String, required: true },
    timeline: [timelineEventSchema],
    effects: { type: choiceEffectsSchema, default: () => ({}) },
  },
  { _id: false }
)

const scenarioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'phishing_bank',
        'phishing_grant',
        'salary_update',
        'investment_scam',
        'tax_refund',
        'account_verification',
        'prize_notification',
      ],
      required: true,
    },
    source: { type: String, enum: ['inbox', 'sms', 'notification'], default: 'inbox' },
    emailMeta: {
      sender: { type: String },
      subject: { type: String },
      preview: { type: String },
      riskBadge: { type: String },
    },
    realContext: { type: String },
    choices: { type: [choiceSchema], validate: v => v.length >= 2 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    targetRoles: {
      type: [String],
      enum: ['student', 'employee', 'freelancer'],
      default: ['student', 'employee', 'freelancer'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Scenario', scenarioSchema)
