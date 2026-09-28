from backend.app.repositories.depot_repository import DepotRepository
from backend.app.repositories.vehicle_type_repository import VehicleTypeRepository
from backend.app.repositories.schedule_repository import ScheduleRepository
from backend.app.repositories.user_repository import UserRepository
from backend.app.repositories.vehicle_repository import VehicleRepository
from backend.app.repositories.odometer_reading_repository import OdometerReadingRepository
from backend.app.repositories.work_order_repository import WorkOrderRepository
from backend.app.repositories.service_due_repository import ServiceDueRepository

__all__ = [
    "DepotRepository",
    "VehicleTypeRepository",
    "ScheduleRepository",
    "UserRepository",
    "VehicleRepository",
    "OdometerReadingRepository",
    "WorkOrderRepository",
    "ServiceDueRepository",
]
