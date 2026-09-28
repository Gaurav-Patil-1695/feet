import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleCreate, VehicleUpdate } from '../types/vehicle';

export const VEHICLES_QUERY_KEY = ['vehicles'] as const;

export function vehicleDetailQueryKey(vehicleId: number | string) {
  return ['vehicles', vehicleId] as const;
}

export function useVehicles() {
  return useQuery<Vehicle[], Error>({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: () => vehicleService.getVehicles(),
  });
}

export function useVehicle(vehicleId: number | string) {
  return useQuery<Vehicle, Error>({
    queryKey: vehicleDetailQueryKey(vehicleId),
    queryFn: () => vehicleService.getVehicle(vehicleId),
    enabled: vehicleId !== undefined && vehicleId !== null && vehicleId !== '',
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation<Vehicle, Error, VehicleCreate>({
    mutationFn: (data: VehicleCreate) => vehicleService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useUpdateVehicle(vehicleId: number | string) {
  const queryClient = useQueryClient();
  return useMutation<Vehicle, Error, VehicleUpdate>({
    mutationFn: (data: VehicleUpdate) => vehicleService.updateVehicle(vehicleId, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      queryClient.setQueryData(vehicleDetailQueryKey(vehicleId), updated);
    },
  });
}
