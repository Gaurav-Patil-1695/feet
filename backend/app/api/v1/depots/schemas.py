from pydantic import BaseModel


class DepotBase(BaseModel):
    name: str
    location: str | None = None


class DepotCreate(DepotBase):
    pass


class DepotUpdate(BaseModel):
    name: str | None = None
    location: str | None = None


class DepotOut(DepotBase):
    id: int

    class Config:
        from_attributes = True


class DepotRead(DepotOut):
    pass
