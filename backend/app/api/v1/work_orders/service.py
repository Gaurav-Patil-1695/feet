from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.v1.work_orders.schemas import WorkOrderCreate, WorkOrderUpdate

_WORK_ORDER_UPDATABLE_FIELDS = frozenset(
    {"description", "assigned_to", "scheduled_date", "status", "updated_at"}
)


class WorkOrderService:
    def __init__(self, db: Session):
        self.db = db

    def _row_to_dict(self, row) -> dict:
        return dict(row._mapping) if hasattr(row, "_mapping") else dict(row)

    def get_work_orders(
        self,
        vehicle_id: UUID | None = None,
        status: str | None = None,
    ) -> list[dict]:
        from sqlalchemy import text

        query = "SELECT * FROM work_orders WHERE 1=1"
        params: dict = {}

        if vehicle_id is not None:
            query += " AND vehicle_id = :vehicle_id"
            params["vehicle_id"] = str(vehicle_id)

        if status is not None:
            query += " AND status = :status"
            params["status"] = status

        query += " ORDER BY created_at DESC"

        result = self.db.execute(text(query), params)
        rows = result.fetchall()
        return [self._row_to_dict(r) for r in rows]

    def get_work_orders_by_user(self, user_id: UUID) -> list[dict]:
        from sqlalchemy import text

        result = self.db.execute(
            text(
                "SELECT * FROM work_orders"
                " WHERE created_by = :user_id ORDER BY created_at DESC"
            ),
            {"user_id": str(user_id)},
        )
        rows = result.fetchall()
        return [self._row_to_dict(r) for r in rows]

    def get_work_order_by_id(self, work_order_id: UUID) -> dict | None:
        from sqlalchemy import text

        result = self.db.execute(
            text("SELECT * FROM work_orders WHERE id = :id"),
            {"id": str(work_order_id)},
        )
        row = result.fetchone()
        if row is None:
            return None
        return self._row_to_dict(row)

    def create_work_order(
        self, payload: WorkOrderCreate, created_by: UUID
    ) -> dict:
        from sqlalchemy import text

        work_order_id = uuid4()
        now = datetime.now(timezone.utc)

        self.db.execute(
            text(
                """
                INSERT INTO work_orders (
                    id, vehicle_id, description, status,
                    assigned_to, scheduled_date, closing_notes,
                    created_by, closed_by, created_at, updated_at, closed_at
                ) VALUES (
                    :id, :vehicle_id, :description, :status,
                    :assigned_to, :scheduled_date, :closing_notes,
                    :created_by, :closed_by, :created_at, :updated_at, :closed_at
                )
                """
            ),
            {
                "id": str(work_order_id),
                "vehicle_id": str(payload.vehicle_id),
                "description": payload.description,
                "status": "open",
                "assigned_to": str(payload.assigned_to) if payload.assigned_to else None,
                "scheduled_date": payload.scheduled_date,
                "closing_notes": None,
                "created_by": str(created_by),
                "closed_by": None,
                "created_at": now,
                "updated_at": now,
                "closed_at": None,
            },
        )
        self.db.commit()

        return self.get_work_order_by_id(work_order_id)

    def update_work_order(
        self, work_order_id: UUID, payload: WorkOrderUpdate
    ) -> dict | None:
        from sqlalchemy import text

        existing = self.get_work_order_by_id(work_order_id)
        if existing is None:
            return None

        if existing["status"] == "closed":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot update a closed work order",
            )

        updates = {}
        if payload.description is not None:
            updates["description"] = payload.description
        if payload.assigned_to is not None:
            updates["assigned_to"] = str(payload.assigned_to)
        if payload.scheduled_date is not None:
            updates["scheduled_date"] = payload.scheduled_date
        if payload.status is not None:
            updates["status"] = payload.status

        if not updates:
            return existing

        updates["updated_at"] = datetime.now(timezone.utc)
        updates["id"] = str(work_order_id)

        # Validate keys against allowlist to prevent SQL injection
        invalid_keys = (set(updates.keys()) - {"id"}) - _WORK_ORDER_UPDATABLE_FIELDS
        if invalid_keys:
            raise ValueError(f"Invalid update fields: {invalid_keys}")

        set_clause = ", ".join(f"{k} = :{k}" for k in updates if k != "id")
        self.db.execute(
            text(f"UPDATE work_orders SET {set_clause} WHERE id = :id"),
            updates,
        )
        self.db.commit()

        return self.get_work_order_by_id(work_order_id)

    def delete_work_order(self, work_order_id: UUID) -> bool:
        from sqlalchemy import text

        existing = self.get_work_order_by_id(work_order_id)
        if existing is None:
            return False

        if existing["status"] == "closed":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot delete a closed work order",
            )

        self.db.execute(
            text("DELETE FROM work_orders WHERE id = :id"),
            {"id": str(work_order_id)},
        )
        self.db.commit()
        return True

    def close_work_order(
        self,
        work_order_id: UUID,
        closed_by: UUID,
        closing_notes: str | None = None,
    ) -> dict | None:
        from sqlalchemy import text

        existing = self.get_work_order_by_id(work_order_id)
        if existing is None:
            return None

        if existing["status"] == "closed":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Work order is already closed",
            )

        now = datetime.now(timezone.utc)

        self.db.execute(
            text(
                """
                UPDATE work_orders
                SET status = 'closed',
                    closed_by = :closed_by,
                    closed_at = :closed_at,
                    closing_notes = :closing_notes,
                    updated_at = :updated_at
                WHERE id = :id
                """
            ),
            {
                "closed_by": str(closed_by),
                "closed_at": now,
                "closing_notes": closing_notes,
                "updated_at": now,
                "id": str(work_order_id),
            },
        )
        self.db.commit()

        self._reset_service_clock(vehicle_id=UUID(str(existing["vehicle_id"])))

        return self.get_work_order_by_id(work_order_id)

    def _reset_service_clock(self, vehicle_id: UUID) -> None:
        """
        Reset the service clock for a vehicle after a work order is closed.
        This delegates to the odometer/service-due logic by updating the
        vehicle's last_service_odometer to the current odometer reading.
        """
        from sqlalchemy import text

        result = self.db.execute(
            text(
                """
                SELECT reading_value
                FROM odometer_readings
                WHERE vehicle_id = :vehicle_id
                ORDER BY reading_date DESC, created_at DESC
                LIMIT 1
                """
            ),
            {"vehicle_id": str(vehicle_id)},
        )
        row = result.fetchone()
        if row is None:
            return

        current_odometer = row[0]
        now = datetime.now(timezone.utc)

        self.db.execute(
            text(
                """
                UPDATE vehicles
                SET last_service_odometer = :odometer,
                    updated_at = :updated_at
                WHERE id = :vehicle_id
                """
            ),
            {
                "odometer": current_odometer,
                "updated_at": now,
                "vehicle_id": str(vehicle_id),
            },
        )
        self.db.commit()
