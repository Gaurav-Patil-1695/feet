export interface OdometerReadingIn {
  vehicle_id: number;
  reading_km: number;
  recorded_at: string;
}

export interface OdometerReadingOut {
  id: number;
  vehicle_id: number;
  reading_km: number;
  recorded_at: string;
}
