require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const userRoutes = require('./routes/userRoutes')
const scenarioRoutes = require('./routes/scenarioRoutes')
const sessionRoutes = require('./routes/sessionRoutes')

const app = express()
const PORT = process.env.PORT || 5020
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finquest'

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes)
app.use('/api/scenarios', scenarioRoutes)
app.use('/api/session', sessionRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack)
  const status = err.status ?? 500
  res.status(status).json({ success: false, message: err.message || 'Internal server error' })
})

// ── Database + Server startup ─────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected:', MONGO_URI)
    app.listen(PORT, () => console.log(`FinQuest API running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
