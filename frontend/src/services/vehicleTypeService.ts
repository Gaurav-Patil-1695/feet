import apiClient from './apiClient';
import type { VehicleType } from '../types/vehicleType';

export const vehicleTypeService = {
  getVehicleTypes: async (): Promise<VehicleType[]> => {
    const response = await apiClient.get<VehicleType[]>('/vehicle-types');
    return response.data;
  },

  getVehicleType: async (typeId: number): Promise<VehicleType> => {
    const response = await apiClient.get<VehicleType>(`/vehicle-types/${typeId}`);
    return response.data;
  },
};
