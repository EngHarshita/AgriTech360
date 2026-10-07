import dotenv from 'dotenv';
import path from 'path';
import { IEnvConfig } from '../types';

// Load .env file from root of server package
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';

// Verify required production variables if running in production
if (nodeEnv === 'production') {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`[Configuration Error] Missing required production environment variables: ${missing.join(', ')}`);
  }
}

export const config: IEnvConfig = {
  env: nodeEnv,
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agritech360'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'agritech360_default_development_secret_key_12345',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  },
  logging: {
    format: process.env.LOG_FORMAT || (nodeEnv === 'production' ? 'combined' : 'dev')
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY || ''
  }
};
