const ok = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data })

const created = (res, data) => ok(res, data, 201)

const fail = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message })

const notFound = (res, message = 'Resource not found') => fail(res, message, 404)

const serverError = (res, message = 'Internal server error') => fail(res, message, 500)

module.exports = { ok, created, fail, notFound, serverError }
