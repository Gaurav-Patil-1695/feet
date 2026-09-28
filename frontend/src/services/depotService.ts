import apiClient from './apiClient';
import type { Depot } from '../types/depot';

export const depotService = {
  getDepots: async (): Promise<Depot[]> => {
    const response = await apiClient.get<Depot[]>('/depots');
    return response.data;
  },

  getDepot: async (depotId: number): Promise<Depot> => {
    const response = await apiClient.get<Depot>(`/depots/${depotId}`);
    return response.data;
  },
};
