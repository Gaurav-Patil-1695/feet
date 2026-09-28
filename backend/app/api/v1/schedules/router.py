from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.api.v1.schedules.schemas import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
)
from backend.app.api.v1.schedules import service
from backend.app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/schedules", tags=["schedules"])


@router.get(
    "", response_model=list[ScheduleResponse], status_code=status.HTTP_200_OK
)
def get_schedules(db: Session = Depends(get_db)):
    result = service.get_schedules(db=db)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No schedules found",
        )
    return result


@router.post(
    "", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED
)
def post_schedules(payload: ScheduleCreate, db: Session = Depends(get_db)):
    result = service.create_schedule(db=db, payload=payload)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create schedule",
        )
    return result


@router.get(
    "/{schedule_id}",
    response_model=ScheduleResponse,
    status_code=status.HTTP_200_OK,
)
def get_schedules_schedule_id(schedule_id: int, db: Session = Depends(get_db)):
    result = service.get_schedule(db=db, schedule_id=schedule_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )
    return result


@router.patch(
    "/{schedule_id}",
    response_model=ScheduleResponse,
    status_code=status.HTTP_200_OK,
)
def patch_schedules_schedule_id(
    schedule_id: int,
    payload: ScheduleUpdate,
    db: Session = Depends(get_db),
):
    result = service.update_schedule(
        db=db, schedule_id=schedule_id, payload=payload
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )
    return result


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedules_schedule_id(
    schedule_id: int, db: Session = Depends(get_db)
):
    service.delete_schedule(db=db, schedule_id=schedule_id)
    return None
