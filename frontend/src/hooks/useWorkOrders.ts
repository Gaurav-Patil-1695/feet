import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrderService } from '../services/workOrderService';
import type { WorkOrder, WorkOrderCreate, WorkOrderClose } from '../types/workOrder';

export const WORK_ORDERS_QUERY_KEY = ['work-orders'] as const;
export const MY_WORK_ORDERS_QUERY_KEY = ['work-orders', 'mine'] as const;

export function workOrderDetailQueryKey(workOrderId: number | string) {
  return ['work-orders', workOrderId] as const;
}

export function useWorkOrders() {
  return useQuery<WorkOrder[], Error>({
    queryKey: WORK_ORDERS_QUERY_KEY,
    queryFn: () => workOrderService.getWorkOrders(),
  });
}

export function useMyWorkOrders() {
  return useQuery<WorkOrder[], Error>({
    queryKey: MY_WORK_ORDERS_QUERY_KEY,
    queryFn: () => workOrderService.getMyWorkOrders(),
  });
}

export function useWorkOrder(workOrderId: number | string) {
  return useQuery<WorkOrder, Error>({
    queryKey: workOrderDetailQueryKey(workOrderId),
    queryFn: () => workOrderService.getWorkOrder(workOrderId),
    enabled: workOrderId !== undefined && workOrderId !== null && workOrderId !== '',
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation<WorkOrder, Error, WorkOrderCreate>({
    mutationFn: (data: WorkOrderCreate) => workOrderService.createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_WORK_ORDERS_QUERY_KEY });
    },
  });
}

export function useCloseWorkOrder(workOrderId: number | string) {
  const queryClient = useQueryClient();
  return useMutation<WorkOrder, Error, WorkOrderClose>({
    mutationFn: (data: WorkOrderClose) => workOrderService.closeWorkOrder(workOrderId, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_WORK_ORDERS_QUERY_KEY });
      queryClient.setQueryData(workOrderDetailQueryKey(workOrderId), updated);
    },
  });
}

export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationFn: (workOrderId: number | string) => workOrderService.deleteWorkOrder(workOrderId),
    onSuccess: (_data, workOrderId) => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_WORK_ORDERS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: workOrderDetailQueryKey(workOrderId) });
    },
  });
}
