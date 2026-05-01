import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import userRoutes from './routes/userRoutes'
import scenarioRoutes from './routes/scenarioRoutes'
import sessionRoutes from './routes/sessionRoutes'

const app = express()
const PORT = process.env.PORT ?? 5020
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/finquest'
const HOST = process.env.HOST ?? '0.0.0.0'

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes)
app.use('/api/scenarios', scenarioRoutes)
app.use('/api/session', sessionRoutes)

// Health check
app.get('/api/health', (_req: Request, res: Response) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
)

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res
    .status(404)
    .json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  const status = err.status ?? 500
  res.status(status).json({ success: false, message: err.message || 'Internal server error' })
})

// ── Database + Server startup ─────────────────────────────────────────────────
const startServer = () => {
  app.listen(Number(PORT), HOST, () => {
    console.log(`FinQuest API listening on http://${HOST}:${PORT}`)
  })
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    startServer()
  })
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err.message)
    startServer()
  })
