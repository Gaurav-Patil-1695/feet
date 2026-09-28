from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.dependencies import get_db, get_current_user
from backend.app.api.v1.vehicles.schemas import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
)
from backend.app.api.v1.vehicles.service import VehicleService

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get(
    "", response_model=list[VehicleResponse], status_code=status.HTTP_200_OK
)
async def get_vehicles(
    depot_id: int | None = Query(None),
    vehicle_type_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    service = VehicleService(db)
    return await service.get_vehicles(
        depot_id=depot_id, vehicle_type_id=vehicle_type_id
    )


@router.post(
    "", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED
)
async def post_vehicles(
    payload: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    service = VehicleService(db)
    return await service.create_vehicle(payload)


@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse,
    status_code=status.HTTP_200_OK,
)
async def get_vehicles_vehicle_id(
    vehicle_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    service = VehicleService(db)
    vehicle = await service.get_vehicle(vehicle_id)
    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found"
        )
    return vehicle


@router.patch(
    "/{vehicle_id}",
    response_model=VehicleResponse,
    status_code=status.HTTP_200_OK,
)
async def patch_vehicles_vehicle_id(
    vehicle_id: int,
    payload: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    service = VehicleService(db)
    vehicle = await service.update_vehicle(vehicle_id, payload)
    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found"
        )
    return vehicle


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicles_vehicle_id(
    vehicle_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    service = VehicleService(db)
    deleted = await service.delete_vehicle(vehicle_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found"
        )
    return None
