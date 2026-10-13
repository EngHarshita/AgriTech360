import { Response } from 'express';
import { weatherService } from '../services';
import { User } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest, WeatherResponse } from '../types';

/**
 * Retrieve agricultural weather intelligence for a location
 * GET /api/v1/weather?location=:location
 */
export const getWeather = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    let location = (req.query.location as string | undefined)?.trim();

    // If location is not provided as query parameter, use the authenticated farmer's district
    if (!location && req.user?.userId) {
      const user = await User.findById(req.user.userId);
      if (user?.district) {
        location = user.district;
      }
    }

    // Default fallback location if still undefined
    if (!location) {
      location = 'Nashik';
    }

    const weatherData = await weatherService.getWeatherForLocation(location);

    const responsePayload: WeatherResponse = {
      success: true,
      weather: weatherData,
      data: weatherData // Dual-envelope for seamless frontend client compatibility
    };

    res.status(200).json(responsePayload);
  }
);
