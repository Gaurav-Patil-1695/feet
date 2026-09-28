from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class WorkOrderIn(BaseModel):
    vehicle_id: UUID
    description: str
    assigned_to: Optional[UUID] = None
    scheduled_date: Optional[datetime] = None


class WorkOrderCreate(WorkOrderIn):
    pass


class WorkOrderUpdate(BaseModel):
    description: Optional[str] = None
    assigned_to: Optional[UUID] = None
    scheduled_date: Optional[datetime] = None
    status: Optional[str] = None


class WorkOrderClose(BaseModel):
    closing_notes: Optional[str] = None


class WorkOrderResponse(BaseModel):
    id: UUID
    vehicle_id: UUID
    description: str
    status: str
    assigned_to: Optional[UUID] = None
    scheduled_date: Optional[datetime] = None
    closing_notes: Optional[str] = None
    created_by: Optional[UUID] = None
    closed_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class WorkOrderOut(WorkOrderResponse):
    pass
