import apiClient from './apiClient';
import type { WorkOrder } from '../types/workOrder';

export interface WorkOrderCreateRequest {
  vehicle_id: number;
  description: string;
  priority?: string;
  notes?: string;
}

export interface WorkOrderCloseRequest {
  resolution_notes?: string;
}

export const workOrderService = {
  getWorkOrders: async (): Promise<WorkOrder[]> => {
    const response = await apiClient.get<WorkOrder[]>('/work-orders');
    return response.data;
  },

  createWorkOrder: async (data: WorkOrderCreateRequest): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>('/work-orders', data);
    return response.data;
  },

  getWorkOrder: async (workOrderId: number): Promise<WorkOrder> => {
    const response = await apiClient.get<WorkOrder>(`/work-orders/${workOrderId}`);
    return response.data;
  },

  closeWorkOrder: async (workOrderId: number, data?: WorkOrderCloseRequest): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>(`/work-orders/${workOrderId}/close`, data ?? {});
    return response.data;
  },

  getMyWorkOrders: async (): Promise<WorkOrder[]> => {
    const response = await apiClient.get<WorkOrder[]>('/work-orders/mine');
    return response.data;
  },
};
