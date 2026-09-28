from fastapi import APIRouter, Depends, status
from typing import List

from backend.app.api.v1.schedules.schemas import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
)
from backend.app.api.v1.schedules import service
from backend.app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/schedules", tags=["schedules"])


@router.get("", response_model=List[ScheduleResponse], status_code=status.HTTP_200_OK)
def get_schedules(db: Session = Depends(get_db)):
    return service.get_schedules(db=db)


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def post_schedules(payload: ScheduleCreate, db: Session = Depends(get_db)):
    return service.create_schedule(db=db, payload=payload)


@router.get("/{scheduleId}", response_model=ScheduleResponse, status_code=status.HTTP_200_OK)
def get_schedules_schedule_id(scheduleId: int, db: Session = Depends(get_db)):
    return service.get_schedule(db=db, schedule_id=scheduleId)


@router.patch("/{scheduleId}", response_model=ScheduleResponse, status_code=status.HTTP_200_OK)
def patch_schedules_schedule_id(scheduleId: int, payload: ScheduleUpdate, db: Session = Depends(get_db)):
    return service.update_schedule(db=db, schedule_id=scheduleId, payload=payload)


@router.delete("/{scheduleId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedules_schedule_id(scheduleId: int, db: Session = Depends(get_db)):
    service.delete_schedule(db=db, schedule_id=scheduleId)
    return None
