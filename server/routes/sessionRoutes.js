const express = require('express')
const router = express.Router()
const { start, getCurrent, answer, result } = require('../controllers/sessionController')

router.post('/start', start)
router.get('/:sessionId/current', getCurrent)
router.post('/:sessionId/answer', answer)
router.get('/:sessionId/result', result)

module.exports = router
