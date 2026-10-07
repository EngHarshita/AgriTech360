import morgan from 'morgan';
import { RequestHandler } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Request logging middleware using Morgan integrated with custom logger
 */
export const requestLogger: RequestHandler = morgan(config.logging.format, {
  stream: logger.stream,
  skip: (req) => {
    // Optionally skip logging health checks in test environment
    return config.env === 'test' && req.url === '/health';
  }
});
