const express = require('express')
const router = express.Router()
const { getUsers, getUser, createUserHandler } = require('../controllers/userController')

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUserHandler)

module.exports = router
