import { Request, Response, NextFunction, RequestHandler } from 'express';
import { QueryFailedError } from 'typeorm';
import { AppError, ValidationError, HttpStatus } from '@utils/errors';
import { sendError } from '@utils/response';
import { logger } from '@utils/logger';
import { env } from '@config/env';

// PostgreSQL error codes
const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Log every error with context
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Operational errors: known, safe to expose
  if (err instanceof ValidationError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // TypeORM database errors
  if (err instanceof QueryFailedError) {
    const dbErr = err as QueryFailedError & { code: string; detail?: string };

    if (dbErr.code === PG_UNIQUE_VIOLATION) {
      return sendError(res, 'A record with that value already exists.', HttpStatus.CONFLICT);
    }

    if (dbErr.code === PG_FOREIGN_KEY_VIOLATION) {
      return sendError(res, 'Related resource not found.', HttpStatus.BAD_REQUEST);
    }

    return sendError(res, 'Database error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Unknown / programming errors: don't leak details in production
  const message = env.isProduction ? 'An unexpected error occurred.' : err.message;
  return sendError(res, message, HttpStatus.INTERNAL_SERVER_ERROR);
};

// Generic asyncHandler — preserves the specific Request subtype (P, ResBody, ReqBody, ReqQuery)
// so controllers can declare typed req parameters without `as` casting.
export const asyncHandler = <
  P extends Record<string, string> = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery extends Record<string, unknown> = Record<string, unknown>,
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => Promise<unknown>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  (req, res, next): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
