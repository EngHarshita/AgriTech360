import mongoose from 'mongoose';
import { config } from './environment';
import { logger } from '../utils/logger';

/**
 * Connect to MongoDB Atlas instance
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    // Connection options for MongoDB / Atlas
    const conn = await mongoose.connect(config.db.uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: config.env !== 'production'
    });

    logger.info(`MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    // In production we may choose to retry or exit depending on orchestration
    throw error;
  }
};

/**
 * Disconnect from MongoDB gracefully
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error while disconnecting MongoDB:', error);
    throw error;
  }
};

/**
 * Get current MongoDB connection state for health monitoring
 */
export const getDBStatus = (): {
  status: 'connected' | 'connecting' | 'disconnecting' | 'disconnected' | 'unknown';
  host?: string;
  name?: string;
} => {
  const readyState = mongoose.connection.readyState;
  const states: Record<number, 'disconnected' | 'connected' | 'connecting' | 'disconnecting'> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const status = states[readyState] || 'unknown';

  return {
    status,
    host: mongoose.connection.host || undefined,
    name: mongoose.connection.name || undefined
  };
};

// Listen for connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost. Attempting reconnection...');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB runtime error:', err);
});
