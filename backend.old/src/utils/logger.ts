import winston from 'winston';
import path from 'path';
import { env } from '@config/env';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const consoleFormat = printf(
  ({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';
    return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
  },
);

const transports: winston.transport[] = [
  new winston.transports.File({
    filename: path.join(env.logging.dir, 'error.log'),
    level: 'error',
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    tailable: true,
  }),
  new winston.transports.File({
    filename: path.join(env.logging.dir, 'combined.log'),
    maxsize: 10 * 1024 * 1024,
    maxFiles: 5,
    tailable: true,
  }),
];

if (!env.isProduction) {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat,
      ),
    }),
  );
}

export const logger = winston.createLogger({
  level: env.logging.level,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(env.logging.dir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(env.logging.dir, 'rejections.log'),
    }),
  ],
});
