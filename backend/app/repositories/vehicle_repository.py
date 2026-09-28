from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.vehicle import Vehicle


class VehicleRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[Vehicle]:
        return self.db.query(Vehicle).order_by(Vehicle.id).all()

    def get_by_id(self, vehicle_id: int) -> Optional[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def get_by_registration(self, registration: str) -> Optional[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.registration == registration).first()

    def get_by_depot_id(self, depot_id: int) -> List[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.depot_id == depot_id).order_by(Vehicle.id).all()

    def get_by_vehicle_type_id(self, vehicle_type_id: int) -> List[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.vehicle_type_id == vehicle_type_id).order_by(Vehicle.id).all()

    def create(self, vehicle: Vehicle) -> Vehicle:
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def update(self, vehicle: Vehicle) -> Vehicle:
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, vehicle: Vehicle) -> None:
        self.db.delete(vehicle)
        self.db.commit()
