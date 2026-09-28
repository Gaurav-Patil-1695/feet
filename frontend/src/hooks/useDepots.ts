import { useQuery } from '@tanstack/react-query';
import { depotService } from '../services/depotService';
import type { Depot } from '../types/depot';

export const DEPOTS_QUERY_KEY = ['depots'] as const;

export function useDepots() {
  return useQuery<Depot[], Error>({
    queryKey: DEPOTS_QUERY_KEY,
    queryFn: () => depotService.getDepots(),
  });
}
