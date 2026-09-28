from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.dependencies import Base


class OdometerReading(Base):
    __tablename__ = "odometer_readings"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    reading_km = Column(Float, nullable=False)
    recorded_at = Column(DateTime, nullable=False)

    vehicle = relationship("Vehicle", back_populates="odometer_readings")
