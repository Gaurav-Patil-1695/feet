from pydantic import BaseModel
from typing import Optional


class DepotBase(BaseModel):
    name: str
    location: Optional[str] = None


class DepotCreate(DepotBase):
    pass


class DepotUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None


class DepotOut(DepotBase):
    id: int

    class Config:
        from_attributes = True


class DepotRead(DepotOut):
    pass
