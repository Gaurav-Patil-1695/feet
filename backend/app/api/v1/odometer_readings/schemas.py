from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class OdometerReadingCreate(BaseModel):
    odometer_value: float = Field(..., description="Odometer reading value in kilometers")
    reading_date: datetime = Field(..., description="Date and time of the odometer reading")
    source: Optional[str] = Field(None, description="Source of the reading, e.g. manual, telematics")
    notes: Optional[str] = Field(None, description="Optional notes about the reading")


class OdometerReadingIn(BaseModel):
    odometer_value: float = Field(..., description="Odometer reading value in kilometers")
    reading_date: datetime = Field(..., description="Date and time of the odometer reading")
    source: Optional[str] = Field(None, description="Source of the reading, e.g. manual, telematics")
    notes: Optional[str] = Field(None, description="Optional notes about the reading")


class OdometerReadingOut(BaseModel):
    id: str
    vehicle_id: str
    odometer_value: float
    reading_date: datetime
    source: Optional[str] = None
    notes: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class OdometerReadingResponse(BaseModel):
    id: str
    vehicle_id: str
    odometer_value: float
    reading_date: datetime
    source: Optional[str] = None
    notes: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TelematicsIngestEntry(BaseModel):
    vehicle_id: str = Field(..., description="Vehicle identifier from the telematics feed")
    odometer_value: float = Field(..., description="Odometer value reported by the telematics device")
    reading_date: datetime = Field(..., description="Timestamp of the telematics reading")
    source: Optional[str] = Field("telematics", description="Source identifier")


class TelematicsIngestPayload(BaseModel):
    readings: List[TelematicsIngestEntry] = Field(..., description="List of telematics readings to ingest")


class TelematicsMockEntry(BaseModel):
    vehicle_id: str = Field(..., description="Vehicle identifier")
    odometer_value: float = Field(..., description="Mock odometer value")
    reading_date: Optional[datetime] = Field(None, description="Optional reading timestamp; defaults to now if omitted")


class TelematicsMockPayload(BaseModel):
    readings: List[TelematicsMockEntry] = Field(..., description="List of mock telematics readings")


class TelematicsIngestResponse(BaseModel):
    processed: int = Field(..., description="Number of readings successfully processed")
    skipped: int = Field(..., description="Number of readings skipped due to errors or duplicates")
    errors: List[str] = Field(default_factory=list, description="List of error messages for skipped readings")
