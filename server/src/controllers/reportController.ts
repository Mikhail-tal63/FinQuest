import { Request, Response } from 'express';
import { generateReport } from '../services/reportService';

// ─────────────────────────────────────────────
// GET /api/report/:userId
// ─────────────────────────────────────────────
export const getReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await generateReport(req.params.userId);
    res.json({ success: true, data: report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message, error });
  }
};
