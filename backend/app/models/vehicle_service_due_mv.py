from sqlalchemy import Column, Integer, String, Float
from backend.app.dependencies import Base


class VehicleServiceDueMV(Base):
    __tablename__ = "vehicle_service_due_mv"
    __table_args__ = {"info": {"is_view": True}}

    vehicle_id = Column(Integer, primary_key=True)
    registration_number = Column(String, nullable=False)
    depot_id = Column(Integer, nullable=True)
    vehicle_type_id = Column(Integer, nullable=True)
    vehicle_type_name = Column(String, nullable=True)
    service_interval_km = Column(Integer, nullable=True)
    latest_odometer_km = Column(Float, nullable=True)
    last_service_km = Column(Float, nullable=True)
    km_since_service = Column(Float, nullable=True)
    km_until_service_due = Column(Float, nullable=True)
    status = Column(String, nullable=True)
