import mongoose from 'mongoose'

export const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id)

export const requireFields = (
  body: Record<string, unknown>,
  fields: string[]
): string | null => {
  const missing = fields.filter(
    f => body[f] === undefined || body[f] === null || body[f] === ''
  )
  return missing.length ? `Missing required fields: ${missing.join(', ')}` : null
}
