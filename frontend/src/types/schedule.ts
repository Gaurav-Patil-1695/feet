export interface ScheduleIn {
  vehicle_id: number;
  scheduled_date: string;
  notes?: string;
}

export interface ScheduleOut {
  id: number;
  vehicle_id: number;
  scheduled_date: string;
  notes?: string;
}
