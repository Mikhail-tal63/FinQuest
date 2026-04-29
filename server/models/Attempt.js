const mongoose = require('mongoose')

const attemptSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
    scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    selectedChoice: { type: Number, required: true },
    qualityLevel: { type: String, enum: ['best', 'average', 'worst'] },
    result: { type: String, enum: ['correct', 'incorrect', 'partial'], required: true },
    effectsApplied: {
      xp: { type: Number, default: 0 },
      securityScore: { type: Number, default: 0 },
      awarenessScore: { type: Number, default: 0 },
      balance: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Attempt', attemptSchema)
