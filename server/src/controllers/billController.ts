import { Request, Response } from 'express';
import Bill from '../models/Bill';
import User from '../models/User';
import Transaction from '../models/Transaction';

// GET /api/bills/:userId
export const getBillsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const bills = await Bill.find({ userId: req.params.userId }).sort({ dueDate: 1 });
    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// POST /api/bills/pay  —  deducts balance, logs transaction
export const payBill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { billId, userId } = req.body;
    if (!billId || !userId) { res.status(400).json({ success: false, message: 'billId and userId are required' }); return; }

    const bill = await Bill.findById(billId);
    if (!bill) { res.status(404).json({ success: false, message: 'Bill not found' }); return; }
    if (bill.status === 'paid') { res.status(400).json({ success: false, message: 'Bill already paid' }); return; }

    const user = await User.findById(userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    if (user.balance < bill.amount) { res.status(400).json({ success: false, message: 'Insufficient balance' }); return; }

    user.balance -= bill.amount;
    // Paying a bill on time reduces risk slightly
    user.riskLevel = Math.max(0, user.riskLevel - 5);
    await user.save();

    bill.status = 'paid';
    await bill.save();

    await Transaction.create({
      userId,
      title: `Bill payment: ${bill.title}`,
      amount: bill.amount,
      type: 'expense',
      category: bill.category,
      date: new Date(),
    });

    res.json({ success: true, data: { bill, updatedBalance: user.balance, riskLevel: user.riskLevel } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
