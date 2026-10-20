import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { agriService } from '../agriService';
import type { MandiPriceItem } from '../../types';

export function useMandiPrices(search?: string, category?: string) {
  return useQuery<MandiPriceItem[]>({
    queryKey: queryKeys.mandi.list(search, category),
    queryFn: () => agriService.getMandiPrices(search, category),
    staleTime: 1000 * 60 * 2, // Mandi prices updated every 2 mins
  });
}
