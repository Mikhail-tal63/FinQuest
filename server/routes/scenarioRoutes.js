const express = require('express')
const router = express.Router()
const { getScenarios, getScenario, submitAnswer } = require('../controllers/scenarioController')

// Order matters: /answer must come before /:id to avoid "answer" being treated as an ObjectId
router.post('/answer', submitAnswer)
router.get('/', getScenarios)
router.get('/:id', getScenario)

module.exports = router
