from backend.app.models.depot import Depot
from backend.app.models.vehicle_type import VehicleType
from backend.app.models.schedule import Schedule
from backend.app.models.user import User
from backend.app.models.vehicle import Vehicle
from backend.app.models.odometer_reading import OdometerReading
from backend.app.models.work_order import WorkOrder
from backend.app.models.vehicle_service_due_mv import VehicleServiceDueMV

__all__ = [
    "Depot",
    "VehicleType",
    "Schedule",
    "User",
    "Vehicle",
    "OdometerReading",
    "WorkOrder",
    "VehicleServiceDueMV",
]
