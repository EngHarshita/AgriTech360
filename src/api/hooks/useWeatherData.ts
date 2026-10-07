import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { agriService } from '../agriService';
import type { WeatherIntelligence } from '../../types';

export function useWeatherIntelligence(location?: string) {
  return useQuery<WeatherIntelligence>({
    queryKey: queryKeys.weather.byLocation(location),
    queryFn: () => agriService.getWeatherIntelligence(location),
    staleTime: 1000 * 60 * 5, // Weather updates fresh for 5 mins
  });
}
