from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.work_order import WorkOrder


class WorkOrderRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[WorkOrder]:
        return self.db.query(WorkOrder).order_by(WorkOrder.id).all()

    def get_by_id(self, work_order_id: int) -> Optional[WorkOrder]:
        return self.db.query(WorkOrder).filter(WorkOrder.id == work_order_id).first()

    def get_by_vehicle_id(self, vehicle_id: int) -> List[WorkOrder]:
        return (
            self.db.query(WorkOrder)
            .filter(WorkOrder.vehicle_id == vehicle_id)
            .order_by(WorkOrder.id)
            .all()
        )

    def get_by_assigned_user_id(self, user_id: int) -> List[WorkOrder]:
        return (
            self.db.query(WorkOrder)
            .filter(WorkOrder.assigned_user_id == user_id)
            .order_by(WorkOrder.id)
            .all()
        )

    def get_open(self) -> List[WorkOrder]:
        return (
            self.db.query(WorkOrder)
            .filter(WorkOrder.closed_at.is_(None))
            .order_by(WorkOrder.id)
            .all()
        )

    def create(self, work_order: WorkOrder) -> WorkOrder:
        self.db.add(work_order)
        self.db.commit()
        self.db.refresh(work_order)
        return work_order

    def update(self, work_order: WorkOrder) -> WorkOrder:
        self.db.commit()
        self.db.refresh(work_order)
        return work_order

    def delete(self, work_order: WorkOrder) -> None:
        self.db.delete(work_order)
        self.db.commit()
