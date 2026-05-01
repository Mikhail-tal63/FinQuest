import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps async route handlers so Express catches rejected promises
 * without requiring try/catch in every controller.
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
