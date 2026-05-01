import { Router } from 'express'
import { getUsers, getUser, createUserHandler } from '../controllers/userController'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', createUserHandler)

export default router
