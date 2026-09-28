from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.dependencies import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, nullable=False, unique=True, index=True)
    depot_id = Column(Integer, ForeignKey("depots.id"), nullable=True)
    vehicle_type_id = Column(Integer, ForeignKey("vehicle_types.id"), nullable=True)
    status = Column(String, nullable=False, default="active")

    depot = relationship("Depot", back_populates="vehicles")
    vehicle_type = relationship("VehicleType", back_populates="vehicles")
    schedules = relationship("Schedule", back_populates="vehicle")
    odometer_readings = relationship("OdometerReading", back_populates="vehicle")
    work_orders = relationship("WorkOrder", back_populates="vehicle")
