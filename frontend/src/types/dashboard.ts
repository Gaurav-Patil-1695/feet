export interface DashboardVehicleRow {
  vehicle_id: number;
  registration_number: string;
  depot_name: string;
  vehicle_type_name: string;
  current_odometer_km: number;
  service_interval_km: number;
  km_until_service: number;
  open_work_orders: number;
}

export interface DashboardOut {
  vehicles: DashboardVehicleRow[];
  total_vehicles: number;
  vehicles_due_for_service: number;
  open_work_orders: number;
}
