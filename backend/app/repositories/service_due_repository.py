from typing import List, Optional

from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.app.models.vehicle_service_due_mv import VehicleServiceDueMV


class ServiceDueRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[VehicleServiceDueMV]:
        return self.db.query(VehicleServiceDueMV).order_by(VehicleServiceDueMV.vehicle_id).all()

    def get_by_vehicle_id(self, vehicle_id: int) -> Optional[VehicleServiceDueMV]:
        return (
            self.db.query(VehicleServiceDueMV)
            .filter(VehicleServiceDueMV.vehicle_id == vehicle_id)
            .first()
        )

    def refresh(self) -> None:
        self.db.execute(text("REFRESH MATERIALIZED VIEW CONCURRENTLY vehicle_service_due_mv"))
        self.db.commit()
