import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import type { DepotServiceSummary, VehicleServiceDue } from '../types/dashboard';

export const DASHBOARD_QUERY_KEY = ['service-due'] as const;

export function dashboardDepotQueryKey(depotId: number | string) {
  return ['service-due', depotId] as const;
}

export function useDashboard() {
  return useQuery<DepotServiceSummary[], Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardService.getServiceDue(),
  });
}

export function useVehicleServiceDue(vehicleId: number | string) {
  return useQuery<VehicleServiceDue, Error>({
    queryKey: dashboardDepotQueryKey(vehicleId),
    queryFn: () => dashboardService.getVehicleServiceDue(vehicleId),
    enabled: vehicleId !== undefined && vehicleId !== null && vehicleId !== '',
  });
}
