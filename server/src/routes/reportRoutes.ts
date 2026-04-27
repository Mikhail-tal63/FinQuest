import { Router } from 'express';
import { getReport } from '../controllers/reportController';

const router = Router();

router.get('/:userId', getReport); // GET /api/report/:userId

export default router;
