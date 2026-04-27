import { Router } from 'express';
import {
  getScenarios,
  getScenarioById,
  answerScenario,
} from '../controllers/scenarioController';

const router = Router();

router.get('/', getScenarios);          // GET /api/scenarios?role=student&source=inbox
router.get('/:id', getScenarioById);    // GET /api/scenarios/:id
router.post('/answer', answerScenario); // POST /api/scenarios/answer

export default router;
