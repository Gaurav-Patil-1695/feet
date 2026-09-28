from typing import List, Optional
from pydantic import BaseModel


class DashboardVehicleRow(BaseModel):
    vehicle_id: int
    registration: str
    vehicle_type: str
    current_odometer: Optional[float]
    service_due_km: Optional[float]
    km_until_service: Optional[float]
    open_work_orders: int

    class Config:
        from_attributes = True


class DashboardOut(BaseModel):
    depot_id: int
    depot_name: str
    total_vehicles: int
    vehicles_due_for_service: int
    open_work_orders: int
    vehicles: List[DashboardVehicleRow]

    class Config:
        from_attributes = True


# Alias used by the router
DashboardResponse = DashboardOut
