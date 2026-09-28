import apiClient from './apiClient';
import type { Schedule } from '../types/schedule';

export interface ScheduleCreateRequest {
  vehicle_id: number;
  service_type: string;
  scheduled_date: string;
  notes?: string;
}

export interface ScheduleUpdateRequest {
  service_type?: string;
  scheduled_date?: string;
  notes?: string;
  status?: string;
}

export const scheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
    const response = await apiClient.get<Schedule[]>('/schedules');
    return response.data;
  },

  createSchedule: async (data: ScheduleCreateRequest): Promise<Schedule> => {
    const response = await apiClient.post<Schedule>('/schedules', data);
    return response.data;
  },

  getSchedule: async (scheduleId: number): Promise<Schedule> => {
    const response = await apiClient.get<Schedule>(`/schedules/${scheduleId}`);
    return response.data;
  },

  updateSchedule: async (scheduleId: number, data: ScheduleUpdateRequest): Promise<Schedule> => {
    const response = await apiClient.patch<Schedule>(`/schedules/${scheduleId}`, data);
    return response.data;
  },
};
