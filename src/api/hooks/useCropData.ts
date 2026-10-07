import { useMutation } from '@tanstack/react-query';
import { agriService } from '../agriService';
import type { CropRecommendation, SoilParams } from '../../types';

export function useCropRecommendationsMutation() {
  return useMutation<CropRecommendation[], Error, Partial<SoilParams>>({
    mutationFn: (params) => agriService.getCropRecommendations(params),
  });
}
