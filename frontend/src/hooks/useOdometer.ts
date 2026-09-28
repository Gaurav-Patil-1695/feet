import { useMutation, useQueryClient } from '@tanstack/react-query';
import { odometerService } from '../services/odometerService';
import type { OdometerReading, OdometerReadingCreate } from '../types/odometerReading';
import { vehicleDetailQueryKey, VEHICLES_QUERY_KEY } from './useVehicles';

export function usePostOdometerReading(vehicleId: number | string) {
  const queryClient = useQueryClient();
  return useMutation<OdometerReading, Error, OdometerReadingCreate>({
    mutationFn: (data: OdometerReadingCreate) =>
      odometerService.postOdometerReading(vehicleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: vehicleDetailQueryKey(vehicleId) });
    },
  });
}
