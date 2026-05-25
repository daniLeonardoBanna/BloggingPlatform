import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { env } from '@config/env';
import { requestLogger } from '@middleware/requestLogger';
import { errorHandler } from '@middleware/errorHandler';
import { sendError } from '@utils/response';
import { HttpStatus } from '@utils/errors';
import router from '@routes/index';

export const createApp = (): Application => {
  const app = express();

  // ── Security ──────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.cors.origins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  app.use(
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, please try again later.' },
    })
  );

  // ── Body Parsing & Compression ────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(compression());

  // ── Logging ───────────────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use(env.apiPrefix, router);

  // ── 404 Handler ───────────────────────────────────────────────────────────
  app.use((req: Request, res: Response) => {
    sendError(res, `Route ${req.method} ${req.path} not found.`, HttpStatus.NOT_FOUND);
  });

  // ── Global Error Handler (must be last) ───────────────────────────────────
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
};
