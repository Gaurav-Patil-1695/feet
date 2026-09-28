export interface WorkOrderIn {
  vehicle_id: number;
  description: string;
  assigned_to_user_id?: number;
}

export interface WorkOrderClose {
  resolution_notes: string;
  closing_odometer_km: number;
}

export interface WorkOrderOut {
  id: number;
  vehicle_id: number;
  description: string;
  assigned_to_user_id?: number;
  status: string;
  created_at: string;
  closed_at?: string;
  resolution_notes?: string;
  closing_odometer_km?: number;
}
