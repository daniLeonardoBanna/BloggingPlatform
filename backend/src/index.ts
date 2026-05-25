import 'reflect-metadata';
import { createApp } from './app';
import { connectDatabase } from '@config/database';
import { env } from '@config/env';
import { logger } from '@utils/logger';

const bootstrap = async (): Promise<void> => {
  try {
    logger.info(`Starting server in [${env.nodeEnv}] mode...`);

    // 1. Connect to the database
    await connectDatabase();
    logger.info('Database connected successfully.');

    // 2. Create and start the Express app
    const app = createApp();
    const server = app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
      logger.info(`API available at http://localhost:${env.port}${env.apiPrefix}`);
    });

    // 3. Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received — shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
