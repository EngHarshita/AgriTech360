import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { agriService } from '../agriService';
import type { GovernmentScheme } from '../../types';

export function useGovernmentSchemes(category?: string) {
  return useQuery<GovernmentScheme[]>({
    queryKey: queryKeys.schemes.list(category),
    queryFn: () => agriService.getGovernmentSchemes(category),
    staleTime: 1000 * 60 * 10, // Schemes rarely change, fresh for 10 mins
  });
}
