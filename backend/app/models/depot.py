from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.app.dependencies import Base


class Depot(Base):
    __tablename__ = "depots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)

    vehicles = relationship("Vehicle", back_populates="depot")
    schedules = relationship("Schedule", back_populates="depot")
