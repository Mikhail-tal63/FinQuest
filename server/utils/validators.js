const mongoose = require('mongoose')

const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id)

const requireFields = (body, fields) => {
  const missing = fields.filter(f => body[f] === undefined || body[f] === null || body[f] === '')
  return missing.length ? `Missing required fields: ${missing.join(', ')}` : null
}

module.exports = { isValidObjectId, requireFields }
