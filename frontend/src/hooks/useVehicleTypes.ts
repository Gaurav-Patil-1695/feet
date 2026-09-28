import { useQuery } from '@tanstack/react-query';
import { vehicleTypeService } from '../services/vehicleTypeService';
import type { VehicleType } from '../types/vehicleType';

export const VEHICLE_TYPES_QUERY_KEY = ['vehicle-types'] as const;

export function useVehicleTypes() {
  return useQuery<VehicleType[], Error>({
    queryKey: VEHICLE_TYPES_QUERY_KEY,
    queryFn: () => vehicleTypeService.getVehicleTypes(),
  });
}
