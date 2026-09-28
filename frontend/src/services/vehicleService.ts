import apiClient from './apiClient';
import type { Vehicle } from '../types/vehicle';

export interface VehicleCreateRequest {
  registration_number: string;
  fleet_number: string;
  depot_id: number;
  vehicle_type_id: number;
  status: string;
  notes?: string;
}

export interface VehicleUpdateRequest {
  registration_number?: string;
  fleet_number?: string;
  depot_id?: number;
  vehicle_type_id?: number;
  status?: string;
  notes?: string;
}

export const vehicleService = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  createVehicle: async (data: VehicleCreateRequest): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  getVehicle: async (vehicleId: number): Promise<Vehicle> => {
    const response = await apiClient.get<Vehicle>(`/vehicles/${vehicleId}`);
    return response.data;
  },

  updateVehicle: async (vehicleId: number, data: VehicleUpdateRequest): Promise<Vehicle> => {
    const response = await apiClient.patch<Vehicle>(`/vehicles/${vehicleId}`, data);
    return response.data;
  },
};
