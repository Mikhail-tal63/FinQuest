import { Router } from 'express'
import { getScenarios, getScenario, submitAnswer } from '../controllers/scenarioController'

const router = Router()

// Order matters: /answer must come before /:id to avoid "answer" being treated as an ObjectId
router.post('/answer', submitAnswer)
router.get('/', getScenarios)
router.get('/:id', getScenario)

export default router
