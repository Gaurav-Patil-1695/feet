from datetime import datetime
from pydantic import BaseModel, Field


class VehicleIn(BaseModel):
    registration_number: str = Field(..., min_length=1, max_length=50)
    vehicle_type_id: int
    depot_id: int
    year: int | None = None
    make: str | None = None
    model: str | None = None
    current_odometer: float | None = None


class VehicleCreate(VehicleIn):
    pass


class VehicleUpdate(BaseModel):
    registration_number: str | None = Field(None, min_length=1, max_length=50)
    vehicle_type_id: int | None = None
    depot_id: int | None = None
    year: int | None = None
    make: str | None = None
    model: str | None = None
    current_odometer: float | None = None


class VehicleOut(BaseModel):
    id: int
    registration_number: str
    vehicle_type_id: int
    depot_id: int
    year: int | None = None
    make: str | None = None
    model: str | None = None
    current_odometer: float | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class VehicleResponse(VehicleOut):
    pass


class VehicleDetailOut(VehicleOut):
    vehicle_type_name: str | None = None
    depot_name: str | None = None

    class Config:
        from_attributes = True
