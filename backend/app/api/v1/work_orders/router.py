from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.dependencies import get_db, get_current_user
from backend.app.api.v1.work_orders.schemas import (
    WorkOrderCreate,
    WorkOrderUpdate,
    WorkOrderResponse,
)
from backend.app.api.v1.work_orders.service import WorkOrderService

router = APIRouter(prefix="/work-orders", tags=["work-orders"])


@router.get("", response_model=List[WorkOrderResponse], status_code=status.HTTP_200_OK)
def get_work_orders(
    vehicle_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = WorkOrderService(db)
    return service.get_work_orders(vehicle_id=vehicle_id, status=status)


@router.get("/mine", response_model=List[WorkOrderResponse], status_code=status.HTTP_200_OK)
def get_my_work_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = WorkOrderService(db)
    return service.get_work_orders_by_user(user_id=current_user.id)


@router.post("", response_model=WorkOrderResponse, status_code=status.HTTP_201_CREATED)
def create_work_order(
    payload: WorkOrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = WorkOrderService(db)
    return service.create_work_order(payload=payload, created_by=current_user.id)


@router.get("/{workOrderId}", response_model=WorkOrderResponse, status_code=status.HTTP_200_OK)
def get_work_order(
    workOrderId: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = WorkOrderService(db)
    work_order = service.get_work_order_by_id(work_order_id=workOrderId)
    if not work_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work order not found")
    return work_order


@router.patch("/{workOrderId}/close", response_model=WorkOrderResponse, status_code=status.HTTP_200_OK)
def close_work_order(
    workOrderId: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = WorkOrderService(db)
    work_order = service.close_work_order(work_order_id=workOrderId, closed_by=current_user.id)
    if not work_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work order not found")
    return work_order
