from pydantic import BaseModel
from typing import Optional


class ScheduleIn(BaseModel):
    vehicle_id: int
    scheduled_date: str
    service_type: str
    notes: Optional[str] = None


class ScheduleOut(BaseModel):
    id: int
    vehicle_id: int
    scheduled_date: str
    service_type: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True


# Aliases used by router.py
ScheduleCreate = ScheduleIn


class ScheduleUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    scheduled_date: Optional[str] = None
    service_type: Optional[str] = None
    notes: Optional[str] = None


ScheduleResponse = ScheduleOut
