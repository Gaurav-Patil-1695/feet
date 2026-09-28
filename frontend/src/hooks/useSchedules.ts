import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services/scheduleService';
import type { Schedule, ScheduleCreate, ScheduleUpdate } from '../types/schedule';

export const SCHEDULES_QUERY_KEY = ['schedules'] as const;

export function scheduleDetailQueryKey(scheduleId: number | string) {
  return ['schedules', scheduleId] as const;
}

export function useSchedules() {
  return useQuery<Schedule[], Error>({
    queryKey: SCHEDULES_QUERY_KEY,
    queryFn: () => scheduleService.getSchedules(),
  });
}

export function useSchedule(scheduleId: number | string) {
  return useQuery<Schedule, Error>({
    queryKey: scheduleDetailQueryKey(scheduleId),
    queryFn: () => scheduleService.getSchedule(scheduleId),
    enabled: scheduleId !== undefined && scheduleId !== null && scheduleId !== '',
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation<Schedule, Error, ScheduleCreate>({
    mutationFn: (data: ScheduleCreate) => scheduleService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
    },
  });
}

export function useUpdateSchedule(scheduleId: number | string) {
  const queryClient = useQueryClient();
  return useMutation<Schedule, Error, ScheduleUpdate>({
    mutationFn: (data: ScheduleUpdate) => scheduleService.updateSchedule(scheduleId, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      queryClient.setQueryData(scheduleDetailQueryKey(scheduleId), updated);
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationFn: (scheduleId: number | string) => scheduleService.deleteSchedule(scheduleId),
    onSuccess: (_data, scheduleId) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      queryClient.removeQueries({ queryKey: scheduleDetailQueryKey(scheduleId) });
    },
  });
}
