import apiClient from './apiClient';
import type { OdometerReading } from '../types/odometerReading';

export interface OdometerReadingCreateRequest {
  reading_value: number;
  recorded_at: string;
}

export const odometerService = {
  createOdometerReading: async (
    vehicleId: number,
    data: OdometerReadingCreateRequest
  ): Promise<OdometerReading> => {
    const response = await apiClient.post<OdometerReading>(
      `/vehicles/${vehicleId}/odometer-readings`,
      data
    );
    return response.data;
  },
};
