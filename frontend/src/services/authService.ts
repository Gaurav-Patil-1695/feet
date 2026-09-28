import apiClient from './apiClient';
import type { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse } from '../types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  refresh: async (data: RefreshRequest): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', data);
    return response.data;
  },
};
