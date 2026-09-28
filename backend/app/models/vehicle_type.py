from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.app.dependencies import Base


class VehicleType(Base):
    __tablename__ = "vehicle_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    service_interval_km = Column(Integer, nullable=True)

    vehicles = relationship("Vehicle", back_populates="vehicle_type")
