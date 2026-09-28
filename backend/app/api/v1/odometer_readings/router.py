from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.dependencies import get_db, get_current_user
from backend.app.api.v1.odometer_readings.schemas import (
    OdometerReadingCreate,
    OdometerReadingResponse,
    TelematicsIngestPayload,
    TelematicsIngestResponse,
    TelematicsMockPayload,
)
from backend.app.api.v1.odometer_readings.service import OdometerReadingsService

router = APIRouter()


@router.post(
    "/vehicles/{vehicleId}/odometer-readings",
    response_model=OdometerReadingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a manual odometer reading for a vehicle",
)
async def create_odometer_reading(
    vehicleId: str,
    payload: OdometerReadingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = OdometerReadingsService(db)
    reading = await service.create_odometer_reading(
        vehicle_id=vehicleId,
        payload=payload,
        created_by=current_user["id"],
    )
    if reading is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    return reading


@router.get(
    "/vehicles/{vehicleId}/odometer-readings",
    response_model=List[OdometerReadingResponse],
    status_code=status.HTTP_200_OK,
    summary="List all odometer readings for a vehicle",
)
async def list_odometer_readings(
    vehicleId: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = OdometerReadingsService(db)
    readings = await service.list_odometer_readings(vehicle_id=vehicleId)
    if readings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    return readings


@router.get(
    "/vehicles/{vehicleId}/odometer-readings/{readingId}",
    response_model=OdometerReadingResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a single odometer reading by ID",
)
async def get_odometer_reading(
    vehicleId: str,
    readingId: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = OdometerReadingsService(db)
    reading = await service.get_odometer_reading(
        vehicle_id=vehicleId,
        reading_id=readingId,
    )
    if reading is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Odometer reading not found",
        )
    return reading


@router.post(
    "/telematics/ingest",
    response_model=TelematicsIngestResponse,
    status_code=status.HTTP_200_OK,
    summary="Ingest telematics feed webhook payload",
)
async def telematics_ingest(
    payload: TelematicsIngestPayload,
    db: AsyncSession = Depends(get_db),
):
    service = OdometerReadingsService(db)
    result = await service.ingest_telematics(payload=payload)
    return result


@router.post(
    "/telematics/ingest-mock",
    response_model=TelematicsIngestResponse,
    status_code=status.HTTP_200_OK,
    summary="Ingest mock telematics data for testing",
)
async def telematics_ingest_mock(
    payload: TelematicsMockPayload,
    db: AsyncSession = Depends(get_db),
):
    service = OdometerReadingsService(db)
    result = await service.ingest_telematics_mock(payload=payload)
    return result
