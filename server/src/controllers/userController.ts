import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import { ok, created, fail, notFound } from '../utils/apiResponse'
import { isValidObjectId, requireFields } from '../utils/validators'
import { getAllUsers, getUserById, createUser } from '../services/userService'
import { Persona } from '../types'

export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await getAllUsers()
  ok(res, users)
})

export const getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  if (!isValidObjectId(id)) { fail(res, 'Invalid user ID'); return }

  const user = await getUserById(id)
  if (!user) { notFound(res, 'User not found'); return }

  ok(res, user)
})

export const createUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const error = requireFields(req.body as Record<string, unknown>, ['name', 'email', 'role'])
    if (error) { fail(res, error); return }

    const { name, email, role, balance } = req.body as {
      name: string
      email: string
      role: string
      balance?: number
    }
    const validRoles: Persona[] = ['student', 'employee', 'freelancer']
    if (!validRoles.includes(role as Persona)) {
      fail(res, `Role must be one of: ${validRoles.join(', ')}`)
      return
    }

    const user = await createUser({ name, email, role, balance })
    created(res, user)
  }
)
