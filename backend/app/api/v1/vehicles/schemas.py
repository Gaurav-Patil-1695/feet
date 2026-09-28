from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class VehicleIn(BaseModel):
    registration_number: str = Field(..., min_length=1, max_length=50)
    vehicle_type_id: int
    depot_id: int
    year: Optional[int] = None
    make: Optional[str] = None
    model: Optional[str] = None
    current_odometer: Optional[float] = None


class VehicleCreate(VehicleIn):
    pass


class VehicleUpdate(BaseModel):
    registration_number: Optional[str] = Field(None, min_length=1, max_length=50)
    vehicle_type_id: Optional[int] = None
    depot_id: Optional[int] = None
    year: Optional[int] = None
    make: Optional[str] = None
    model: Optional[str] = None
    current_odometer: Optional[float] = None


class VehicleOut(BaseModel):
    id: int
    registration_number: str
    vehicle_type_id: int
    depot_id: int
    year: Optional[int] = None
    make: Optional[str] = None
    model: Optional[str] = None
    current_odometer: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VehicleResponse(VehicleOut):
    pass


class VehicleDetailOut(VehicleOut):
    vehicle_type_name: Optional[str] = None
    depot_name: Optional[str] = None

    class Config:
        from_attributes = True
