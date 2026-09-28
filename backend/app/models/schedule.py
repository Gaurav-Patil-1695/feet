from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.dependencies import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    depot_id = Column(Integer, ForeignKey("depots.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    driver_name = Column(String, nullable=True)
    scheduled_date = Column(Date, nullable=False)
    route = Column(String, nullable=True)
    status = Column(String, nullable=False, default="scheduled")

    depot = relationship("Depot", back_populates="schedules")
    vehicle = relationship("Vehicle", back_populates="schedules")
