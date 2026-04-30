const express = require('express')
const router = express.Router()
const { start, getCurrent, answer, result, getScenarios } = require('../controllers/sessionController')

router.post('/start', start)
router.get('/:sessionId/current', getCurrent)
router.get('/:sessionId/scenarios', getScenarios)
router.post('/:sessionId/answer', answer)
router.get('/:sessionId/result', result)

module.exports = router
