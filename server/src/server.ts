import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';

// ── Routes ──────────────────────────────────────────────────────────────────
import userRoutes from './routes/userRoutes';
import scenarioRoutes from './routes/scenarioRoutes';
import billRoutes from './routes/billRoutes';
import transactionRoutes from './routes/transactionRoutes';
import reportRoutes from './routes/reportRoutes';

// ── App setup ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT ?? 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/report', reportRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 finquist server running on http://localhost:${PORT}`);
  });
});

export default app;
