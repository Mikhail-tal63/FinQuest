const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ['student', 'employee', 'freelancer'],
      default: 'employee',
    },
    balance: { type: Number, default: 5000 },
    xp: { type: Number, default: 0 },
    securityScore: { type: Number, default: 50, min: 0, max: 100 },
    awarenessScore: { type: Number, default: 50, min: 0, max: 100 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
