from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from backend.app.api.v1.vehicle_types.schemas import (
    VehicleTypeCreate,
    VehicleTypeUpdate,
    VehicleTypeRead,
)


class VehicleTypeService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_vehicle_types(self) -> list[VehicleTypeRead]:
        from backend.app.models import VehicleType

        result = await self.db.execute(select(VehicleType).order_by(VehicleType.id))
        rows = result.scalars().all()
        return [VehicleTypeRead.model_validate(row) for row in rows]

    async def get_vehicle_type(self, vehicle_type_id: int) -> VehicleTypeRead | None:
        from backend.app.models import VehicleType

        result = await self.db.execute(
            select(VehicleType).where(VehicleType.id == vehicle_type_id)
        )
        row = result.scalar_one_or_none()
        if row is None:
            return None
        return VehicleTypeRead.model_validate(row)

    async def create_vehicle_type(self, payload: VehicleTypeCreate) -> VehicleTypeRead:
        from backend.app.models import VehicleType

        vehicle_type = VehicleType(
            name=payload.name,
            description=payload.description,
        )
        self.db.add(vehicle_type)
        await self.db.commit()
        await self.db.refresh(vehicle_type)
        return VehicleTypeRead.model_validate(vehicle_type)

    async def update_vehicle_type(
        self, vehicle_type_id: int, payload: VehicleTypeUpdate
    ) -> VehicleTypeRead | None:
        from backend.app.models import VehicleType

        result = await self.db.execute(
            select(VehicleType).where(VehicleType.id == vehicle_type_id)
        )
        vehicle_type = result.scalar_one_or_none()
        if vehicle_type is None:
            return None

        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(vehicle_type, field, value)

        await self.db.commit()
        await self.db.refresh(vehicle_type)
        return VehicleTypeRead.model_validate(vehicle_type)

    async def delete_vehicle_type(self, vehicle_type_id: int) -> bool:
        from backend.app.models import VehicleType

        result = await self.db.execute(
            select(VehicleType).where(VehicleType.id == vehicle_type_id)
        )
        vehicle_type = result.scalar_one_or_none()
        if vehicle_type is None:
            return False

        await self.db.execute(
            delete(VehicleType).where(VehicleType.id == vehicle_type_id)
        )
        await self.db.commit()
        return True
