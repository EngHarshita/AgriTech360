import { config } from '../config';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import {
  CropRecommendationInput,
  NormalizedCropInput,
  CropRecommendationResponse
} from '../types';

/**
 * Validates and normalizes soil and climate inputs for crop recommendation.
 * Supports standard parameter names (N, P, K, humidity, ph) and frontend aliases
 * (nitrogen, phosphorus, potassium, moisture, phLevel).
 */
export const validateCropInput = (body: CropRecommendationInput): NormalizedCropInput => {
  if (!body || typeof body !== 'object') {
    throw ApiError.badRequest('Request body must be a JSON object containing soil and environmental parameters.');
  }

  const parseNumericField = (
    value: unknown,
    fieldName: string,
    min: number,
    max: number,
    unit: string = ''
  ): number => {
    if (value === undefined || value === null || value === '') {
      throw ApiError.badRequest(`Field "${fieldName}" is required.`);
    }

    const num = typeof value === 'number' ? value : Number(value);

    if (isNaN(num) || !isFinite(num)) {
      throw ApiError.badRequest(`Field "${fieldName}" must be a valid numeric value.`);
    }

    if (num < min || num > max) {
      throw ApiError.badRequest(
        `Field "${fieldName}" must be between ${min} and ${max}${unit ? ' ' + unit : ''}. Provided: ${num}`
      );
    }

    return num;
  };

  const rawN = body.N !== undefined ? body.N : body.nitrogen;
  const rawP = body.P !== undefined ? body.P : body.phosphorus;
  const rawK = body.K !== undefined ? body.K : body.potassium;
  const rawTemp = body.temperature;
  const rawHumidity = body.humidity !== undefined ? body.humidity : body.moisture;
  const rawPh = body.ph !== undefined ? body.ph : body.phLevel;
  const rawRainfall = body.rainfall;

  const N = parseNumericField(rawN, 'nitrogen (or N)', 0, 300, 'kg/ha');
  const P = parseNumericField(rawP, 'phosphorus (or P)', 0, 300, 'kg/ha');
  const K = parseNumericField(rawK, 'potassium (or K)', 0, 300, 'kg/ha');
  const temperature = parseNumericField(rawTemp, 'temperature', -10, 60, '°C');
  const humidity = parseNumericField(rawHumidity, 'moisture (or humidity)', 0, 100, '%');
  const ph = parseNumericField(rawPh, 'phLevel (or ph)', 0, 14);
  const rainfall = parseNumericField(rawRainfall, 'rainfall', 0, 5000, 'mm');

  return {
    N,
    P,
    K,
    temperature,
    humidity,
    ph,
    rainfall,
    soilType: body.soilType || 'Black'
  };
};

/**
 * Service to bridge Node.js backend with the Python FastAPI ML microservice.
 */
export const getCropRecommendations = async (
  input: CropRecommendationInput
): Promise<CropRecommendationResponse> => {
  // 1. Validate and normalize input
  const normalized = validateCropInput(input);

  const baseUrl = process.env.ML_SERVICE_URL || config.mlService.url;
  const mlServiceUrl = `${baseUrl}/predict`;

  logger.info(`Forwarding crop recommendation inference to Python ML service: ${mlServiceUrl}`);

  try {
    const response = await fetch(mlServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(normalized),
      signal: AbortSignal.timeout(config.mlService.timeoutMs)
    });

    if (!response.ok) {
      let errorMessage = `ML service returned status ${response.status}`;
      try {
        const errorBody = await response.json() as { detail?: string };
        if (errorBody?.detail) {
          errorMessage = errorBody.detail;
        }
      } catch {
        // Fall back to default message if JSON parsing fails
      }
      logger.error(`Python ML service returned error: ${errorMessage}`);
      throw new ApiError(response.status >= 400 && response.status < 500 ? response.status : 502, errorMessage);
    }

    const data = await response.json() as {
      success: boolean;
      crop: string;
      confidence: number;
      recommendation: any;
      recommendations?: any[];
      input_features: Record<string, number>;
    };

    const recommendationsList = Array.isArray(data.recommendations) && data.recommendations.length > 0
      ? data.recommendations
      : [data.recommendation];

    return {
      success: true,
      message: 'Crop recommendations generated successfully via ML service',
      crop: data.crop,
      confidence: data.confidence,
      recommendation: data.recommendation,
      data: recommendationsList,
      input_features: data.input_features
    };
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }

    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      logger.error(`Python ML microservice timed out after ${config.mlService.timeoutMs}ms`);
      throw new ApiError(
        504,
        `ML Recommendation Service timed out after ${config.mlService.timeoutMs}ms. Please try again later.`
      );
    }

    logger.error('Failed to communicate with Python ML microservice:', err);
    throw new ApiError(
      503,
      'ML Crop Recommendation service is currently unavailable. Please verify the Python ML service is running.'
    );
  }
};
