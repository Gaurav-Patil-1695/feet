import apiClient from './apiClient';
import type { DashboardData } from '../types/dashboard';

export const dashboardService = {
  getDashboard: async (depotId: number): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>(`/depots/${depotId}/dashboard`);
    return response.data;
  },
};
