from typing import List, Optional
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


@router.get("", response_model=List[VehicleResponse], status_code=status.HTTP_200_OK)
async def get_vehicles(
    depot_id: Optional[int] = Query(None),
    vehicle_type_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)
    return await service.get_vehicles(depot_id=depot_id, vehicle_type_id=vehicle_type_id)


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
async def post_vehicles(
    payload: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)
    return await service.create_vehicle(payload)


@router.get("/{vehicleId}", response_model=VehicleResponse, status_code=status.HTTP_200_OK)
async def get_vehicles_vehicle_id(
    vehicleId: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)
    vehicle = await service.get_vehicle(vehicleId)
    if vehicle is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle


@router.patch("/{vehicleId}", response_model=VehicleResponse, status_code=status.HTTP_200_OK)
async def patch_vehicles_vehicle_id(
    vehicleId: int,
    payload: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)
    vehicle = await service.update_vehicle(vehicleId, payload)
    if vehicle is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle


@router.delete("/{vehicleId}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicles_vehicle_id(
    vehicleId: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)
    deleted = await service.delete_vehicle(vehicleId)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return None
