const asyncHandler = require('../utils/asyncHandler')
const { ok, created, fail, notFound } = require('../utils/apiResponse')
const { isValidObjectId, requireFields } = require('../utils/validators')
const { getAllUsers, getUserById, createUser } = require('../services/userService')

const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers()
  ok(res, users)
})

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) return fail(res, 'Invalid user ID')

  const user = await getUserById(id)
  if (!user) return notFound(res, 'User not found')

  ok(res, user)
})

const createUserHandler = asyncHandler(async (req, res) => {
  const error = requireFields(req.body, ['name', 'email', 'role'])
  if (error) return fail(res, error)

  const { name, email, role, balance } = req.body
  const validRoles = ['student', 'employee', 'freelancer']
  if (!validRoles.includes(role)) return fail(res, `Role must be one of: ${validRoles.join(', ')}`)

  const user = await createUser({ name, email, role, balance })
  created(res, user)
})

module.exports = { getUsers, getUser, createUserHandler }
