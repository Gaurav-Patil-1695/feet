from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class WorkOrderIn(BaseModel):
    vehicle_id: UUID
    description: str
    assigned_to: UUID | None = None
    scheduled_date: datetime | None = None


class WorkOrderCreate(WorkOrderIn):
    pass


class WorkOrderUpdate(BaseModel):
    description: str | None = None
    assigned_to: UUID | None = None
    scheduled_date: datetime | None = None
    status: str | None = None


class WorkOrderClose(BaseModel):
    closing_notes: str | None = None


class WorkOrderResponse(BaseModel):
    id: UUID
    vehicle_id: UUID
    description: str
    status: str
    assigned_to: UUID | None = None
    scheduled_date: datetime | None = None
    closing_notes: str | None = None
    created_by: UUID | None = None
    closed_by: UUID | None = None
    created_at: datetime
    updated_at: datetime
    closed_at: datetime | None = None

    class Config:
        from_attributes = True


class WorkOrderOut(WorkOrderResponse):
    pass
