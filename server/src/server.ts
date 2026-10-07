import { Server } from 'http';
import app from './app';
import { config, connectDB, disconnectDB } from './config';
import { logger } from './utils/logger';

let server: Server;

/**
 * Bootstrap and start the AgriTech360 server
 */
const startServer = async (): Promise<void> => {
  try {
    // 1. Establish MongoDB Atlas connection
    logger.info('Initializing MongoDB Atlas connection...');
    await connectDB();

    // 2. Start HTTP server
    server = app.listen(config.port, () => {
      logger.info(`AgriTech360 backend is running in [${config.env}] mode`);
      logger.info(`Server URL: http://localhost:${config.port}`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
      logger.info(`API Base URL: http://localhost:${config.port}${config.apiPrefix}`);
    });
  } catch (error) {
    logger.error('Critical failure during server startup:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const handleGracefulShutdown = async (signal: string): Promise<void> => {
  logger.warn(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed. Releasing active database connections...');
      try {
        await disconnectDB();
        logger.info('Graceful shutdown completed successfully.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during database disconnect:', err);
        process.exit(1);
      }
    });

    // Force shutdown after timeout in case connections hang
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout while closing connections.');
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
};

// Process error and termination handlers
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection detected:', reason);
  // Recommend restarting process in production if unhandled promise rejection occurs
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception detected! Terminating process:', error);
  process.exit(1);
});

// Start the server
startServer();
