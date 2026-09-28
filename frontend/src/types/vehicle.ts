import { DepotOut } from './depot';
import { VehicleTypeOut } from './vehicleType';

export interface VehicleIn {
  registration_number: string;
  depot_id: number;
  vehicle_type_id: number;
  current_odometer_km: number;
}

export interface VehicleOut {
  id: number;
  registration_number: string;
  depot_id: number;
  vehicle_type_id: number;
  current_odometer_km: number;
}

export interface VehicleDetailOut {
  id: number;
  registration_number: string;
  depot_id: number;
  vehicle_type_id: number;
  current_odometer_km: number;
  depot: DepotOut;
  vehicle_type: VehicleTypeOut;
}
