import { Router } from 'express';
import Transaction from '../models/Transaction';

const router = Router();

// GET /api/transactions/:userId
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({
      date: -1,
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

export default router;
