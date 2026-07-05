import 'dotenv/config';
import jwt from 'jsonwebtoken';

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: requireEnv('DB_USERNAME'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_DATABASE'),
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || 'logs',
  },

  auth: {
    jwt: {
      accessTokenSecret: requireEnv('JWT_ACCESS_TOKEN_SECRET'),
      accessTokenExpiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ||
        '1h') as jwt.SignOptions['expiresIn'],
      refreshTokenSecret: requireEnv('JWT_REFRESH_TOKEN_SECRET'),
      refreshTokenExpiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
        '7d') as jwt.SignOptions['expiresIn'],
    },
  },
} as const;
