import { Response } from 'express'

export const ok = (res: Response, data: unknown, statusCode = 200): void => {
  res.status(statusCode).json({ success: true, data })
}

export const created = (res: Response, data: unknown): void => ok(res, data, 201)

export const fail = (res: Response, message: string, statusCode = 400): void => {
  res.status(statusCode).json({ success: false, message })
}

export const notFound = (res: Response, message = 'Resource not found'): void =>
  fail(res, message, 404)

export const serverError = (res: Response, message = 'Internal server error'): void =>
  fail(res, message, 500)
