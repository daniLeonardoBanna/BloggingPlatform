import morgan, { StreamOptions } from 'morgan';
import { Handler, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { env } from '@config/env';

const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

// Custom token: response body size
morgan.token('body', (req: Request) =>
  req.method !== 'GET' ? JSON.stringify(req.body) : '-',
);

const format = env.isProduction
  ? ':remote-addr :method :url :status :res[content-length] - :response-time ms'
  : ':method :url :status :response-time ms - :res[content-length] :body';

// Skip health check spam
const skip = (_req: Request, res: Response): boolean =>
  env.isProduction && res.statusCode < 400;

export const requestLogger: Handler = morgan(format, { stream, skip });
