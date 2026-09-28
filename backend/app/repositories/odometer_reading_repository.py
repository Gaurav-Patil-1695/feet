from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.odometer_reading import OdometerReading


class OdometerReadingRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[OdometerReading]:
        return self.db.query(OdometerReading).order_by(OdometerReading.id).all()

    def get_by_id(self, reading_id: int) -> Optional[OdometerReading]:
        return self.db.query(OdometerReading).filter(OdometerReading.id == reading_id).first()

    def get_by_vehicle_id(self, vehicle_id: int) -> List[OdometerReading]:
        return (
            self.db.query(OdometerReading)
            .filter(OdometerReading.vehicle_id == vehicle_id)
            .order_by(OdometerReading.id)
            .all()
        )

    def get_latest_by_vehicle_id(self, vehicle_id: int) -> Optional[OdometerReading]:
        return (
            self.db.query(OdometerReading)
            .filter(OdometerReading.vehicle_id == vehicle_id)
            .order_by(OdometerReading.id.desc())
            .first()
        )

    def create(self, odometer_reading: OdometerReading) -> OdometerReading:
        self.db.add(odometer_reading)
        self.db.commit()
        self.db.refresh(odometer_reading)
        return odometer_reading

    def update(self, odometer_reading: OdometerReading) -> OdometerReading:
        self.db.commit()
        self.db.refresh(odometer_reading)
        return odometer_reading

    def delete(self, odometer_reading: OdometerReading) -> None:
        self.db.delete(odometer_reading)
        self.db.commit()
