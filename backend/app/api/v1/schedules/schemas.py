from pydantic import BaseModel


class ScheduleIn(BaseModel):
    vehicle_id: int
    scheduled_date: str
    service_type: str
    notes: str | None = None


class ScheduleOut(BaseModel):
    id: int
    vehicle_id: int
    scheduled_date: str
    service_type: str
    notes: str | None = None

    class Config:
        from_attributes = True


# Aliases used by router.py
ScheduleCreate = ScheduleIn


class ScheduleUpdate(BaseModel):
    vehicle_id: int | None = None
    scheduled_date: str | None = None
    service_type: str | None = None
    notes: str | None = None


ScheduleResponse = ScheduleOut
