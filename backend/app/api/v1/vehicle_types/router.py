from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.dependencies import get_db
from backend.app.api.v1.vehicle_types.schemas import VehicleTypeRead
from backend.app.api.v1.vehicle_types.service import VehicleTypeService

router = APIRouter(prefix="/vehicle-types", tags=["vehicle-types"])


@router.get(
    "", response_model=list[VehicleTypeRead], status_code=status.HTTP_200_OK
)
async def get_vehicle_types(
    db: AsyncSession = Depends(get_db),
) -> list[VehicleTypeRead]:
    service = VehicleTypeService(db)
    result = await service.get_vehicle_types()
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No vehicle types found",
        )
    return result


@router.get(
    "/{vehicle_type_id}",
    response_model=VehicleTypeRead,
    status_code=status.HTTP_200_OK,
)
async def get_vehicle_type(
    vehicle_type_id: int, db: AsyncSession = Depends(get_db)
) -> VehicleTypeRead:
    service = VehicleTypeService(db)
    vehicle_type = await service.get_vehicle_type(vehicle_type_id)
    if vehicle_type is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle type not found",
        )
    return vehicle_type
