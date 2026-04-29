const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scenarioIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }],
    currentIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    totalXP: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
)

sessionSchema.virtual('isFinished').get(function () {
  return this.currentIndex >= this.scenarioIds.length
})

module.exports = mongoose.model('Session', sessionSchema)
