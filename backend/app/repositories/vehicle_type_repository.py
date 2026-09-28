from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.vehicle_type import VehicleType


class VehicleTypeRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[VehicleType]:
        return self.db.query(VehicleType).order_by(VehicleType.name).all()

    def get_by_id(self, vehicle_type_id: int) -> Optional[VehicleType]:
        return self.db.query(VehicleType).filter(VehicleType.id == vehicle_type_id).first()

    def get_by_name(self, name: str) -> Optional[VehicleType]:
        return self.db.query(VehicleType).filter(VehicleType.name == name).first()

    def create(self, vehicle_type: VehicleType) -> VehicleType:
        self.db.add(vehicle_type)
        self.db.commit()
        self.db.refresh(vehicle_type)
        return vehicle_type

    def update(self, vehicle_type: VehicleType) -> VehicleType:
        self.db.commit()
        self.db.refresh(vehicle_type)
        return vehicle_type

    def delete(self, vehicle_type: VehicleType) -> None:
        self.db.delete(vehicle_type)
        self.db.commit()
