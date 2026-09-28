from pydantic import BaseModel


class VehicleTypeBase(BaseModel):
    name: str
    description: str | None = None


class VehicleTypeCreate(VehicleTypeBase):
    pass


class VehicleTypeUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class VehicleTypeRead(VehicleTypeBase):
    id: int

    model_config = {"from_attributes": True}


VehicleTypeOut = VehicleTypeRead
