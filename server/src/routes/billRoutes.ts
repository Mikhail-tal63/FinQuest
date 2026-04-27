import { Router } from 'express';
import { getBillsByUser, payBill } from '../controllers/billController';

const router = Router();

router.get('/:userId', getBillsByUser); // GET /api/bills/:userId
router.post('/pay', payBill);           // POST /api/bills/pay

export default router;
