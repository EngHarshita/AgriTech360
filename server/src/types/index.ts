import { Request } from 'express';
import { Document, Model } from 'mongoose';

/**
 * Standard Environment Configuration Interface
 */
export interface IEnvConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  db: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  logging: {
    format: string;
  };
  weather: {
    apiKey: string;
  };
}

/**
 * Permitted User Roles in AgriTech360
 */
export type UserRole = 'farmer' | 'expert' | 'buyer' | 'admin';

/**
 * Core User Attributes
 */
export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  district: string;
  state: string;
  landHolding: number;
  soilType: string;
  irrigationType: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User without sensitive fields (safe for client responses)
 */
export interface ISafeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  state: string;
  landHolding: number;
  soilType: string;
  irrigationType: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose User Document with instance methods
 */
export interface IUserDocument extends Document, Omit<IUser, 'password'> {
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeObject(): ISafeUser;
}

/**
 * Mongoose User Model type
 */
export type IUserModel = Model<IUserDocument>;

/**
 * Register Request Payload DTO
 */
export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  district: string;
  state: string;
  landHolding: number;
  soilType: string;
  irrigationType: string;
  role?: UserRole;
}

/**
 * Login Request Payload DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Update Profile Payload DTO (Allowed editable fields for farmers)
 */
export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  district?: string;
  state?: string;
  landHolding?: number;
  soilType?: string;
  irrigationType?: string;
}

/**
 * Profile Response Envelope
 */
export interface ProfileResponse {
  success: boolean;
  message?: string;
  user: ISafeUser;
}

/**
 * Trend direction for farm analytics metrics
 */
export type MetricTrend = 'up' | 'down' | 'stable';

/**
 * Farm Metric item interface for dashboard analytics
 */
export interface FarmMetric {
  id?: string;
  title: string;
  value: number;
  unit: string;
  trend: MetricTrend;
  change?: string;
  isPositive?: boolean;
  description?: string;
  iconName?: string;
}

/**
 * Dashboard Metrics API response payload
 */
export interface DashboardMetricsResponse {
  success: boolean;
  metrics: FarmMetric[];
  data?: FarmMetric[];
}

/**
 * Spray suitability rating for agricultural applications
 */
export type SpraySuitability = 'Excellent' | 'Good' | 'Fair' | 'Poor';

/**
 * Hourly weather forecast data point
 */
export interface WeatherHour {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  pop: number; // Probability of precipitation (%)
  windSpeed: number;
}

/**
 * Daily 7-day weather forecast data point
 */
export interface WeatherDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  rainfallMm: number;
  humidity: number;
  spraySuitability: SpraySuitability;
}

/**
 * Agricultural weather advisory item
 */
export interface AgriculturalAdvisory {
  title: string;
  level: 'Safe' | 'Caution' | 'Alert';
  message: string;
  irrigationRecommendation: string;
  pestRiskLevel: 'Low' | 'Moderate' | 'High';
}

/**
 * Complete Weather Intelligence entity
 */
export interface WeatherIntelligence {
  location: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfallProbability: number;
  soilTemperature: number;
  evapotranspiration: number;
  spraySuitability: SpraySuitability;
  advisory: string;
  forecast24h: WeatherHour[];
  forecast7d: WeatherDay[];
  current?: {
    temp: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    uvIndex: number;
    rainfallPast24h: number;
    soilTemperature: number;
    evapotranspiration: number;
  };
  agriculturalAdvisory?: AgriculturalAdvisory;
  hourly?: WeatherHour[];
  forecast?: WeatherDay[];
}

/**
 * Weather API Response Envelope
 */
export interface WeatherResponse {
  success: boolean;
  weather: WeatherIntelligence;
  data?: WeatherIntelligence;
}

/**
 * Auth Result returned by services
 */
export interface AuthResult {
  token: string;
  user: ISafeUser;
}

/**
 * JWT Payload structure for authenticated users
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Express Request extension with authenticated user payload
 */
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * Standard API Response envelope
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Standard API Error Response envelope
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: unknown[];
  stack?: string;
  timestamp: string;
}

/**
 * Paginated API Response Envelope
 */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}

/**
 * Health check status payload
 */
export interface HealthCheckData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  environment: string;
  nodeVersion: string;
  memoryUsage: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  };
  database: {
    status: 'connected' | 'connecting' | 'disconnecting' | 'disconnected' | 'unknown';
    host?: string;
    name?: string;
  };
}
