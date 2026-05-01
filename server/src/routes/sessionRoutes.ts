import { Router } from 'express'
import { start, getCurrent, answer, result, getScenarios } from '../controllers/sessionController'

const router = Router()

router.post('/start', start)
router.get('/:sessionId/current', getCurrent)
router.get('/:sessionId/scenarios', getScenarios)
router.post('/:sessionId/answer', answer)
router.get('/:sessionId/result', result)

export default router
