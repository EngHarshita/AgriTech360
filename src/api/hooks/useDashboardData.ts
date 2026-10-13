import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { agriService } from '../agriService';
import type { FarmMetric } from '../../types';

export function useDashboardMetrics() {
  return useQuery<FarmMetric[]>({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: () => agriService.getDashboardMetrics(),
  });
}
