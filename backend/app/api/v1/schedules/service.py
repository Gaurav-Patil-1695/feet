from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.api.v1.schedules.schemas import ScheduleCreate, ScheduleUpdate


def get_schedules(db: Session) -> List[dict]:
    result = db.execute(text("SELECT * FROM schedules ORDER BY id"))
    rows = result.mappings().all()
    return [dict(row) for row in rows]


def get_schedule(db: Session, schedule_id: int) -> dict:
    result = db.execute(
        text("SELECT * FROM schedules WHERE id = :id"),
        {"id": schedule_id},
    )
    row = result.mappings().first()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule {schedule_id} not found",
        )
    return dict(row)


def create_schedule(db: Session, payload: ScheduleCreate) -> dict:
    result = db.execute(
        text(
            """
            INSERT INTO schedules (vehicle_id, scheduled_date, service_type, notes)
            VALUES (:vehicle_id, :scheduled_date, :service_type, :notes)
            RETURNING *
            """
        ),
        {
            "vehicle_id": payload.vehicle_id,
            "scheduled_date": payload.scheduled_date,
            "service_type": payload.service_type,
            "notes": payload.notes,
        },
    )
    db.commit()
    row = result.mappings().first()
    _recalculate_service_due_for_vehicle(db=db, vehicle_id=payload.vehicle_id)
    return dict(row)


def update_schedule(db: Session, schedule_id: int, payload: ScheduleUpdate) -> dict:
    existing = get_schedule(db=db, schedule_id=schedule_id)

    updated_vehicle_id = payload.vehicle_id if payload.vehicle_id is not None else existing["vehicle_id"]
    updated_scheduled_date = payload.scheduled_date if payload.scheduled_date is not None else existing["scheduled_date"]
    updated_service_type = payload.service_type if payload.service_type is not None else existing["service_type"]
    updated_notes = payload.notes if payload.notes is not None else existing["notes"]

    result = db.execute(
        text(
            """
            UPDATE schedules
            SET vehicle_id = :vehicle_id,
                scheduled_date = :scheduled_date,
                service_type = :service_type,
                notes = :notes
            WHERE id = :id
            RETURNING *
            """
        ),
        {
            "id": schedule_id,
            "vehicle_id": updated_vehicle_id,
            "scheduled_date": updated_scheduled_date,
            "service_type": updated_service_type,
            "notes": updated_notes,
        },
    )
    db.commit()
    row = result.mappings().first()

    affected_vehicles = {existing["vehicle_id"], updated_vehicle_id}
    for vehicle_id in affected_vehicles:
        _recalculate_service_due_for_vehicle(db=db, vehicle_id=vehicle_id)

    return dict(row)


def delete_schedule(db: Session, schedule_id: int) -> None:
    existing = get_schedule(db=db, schedule_id=schedule_id)
    vehicle_id = existing["vehicle_id"]

    db.execute(
        text("DELETE FROM schedules WHERE id = :id"),
        {"id": schedule_id},
    )
    db.commit()
    _recalculate_service_due_for_vehicle(db=db, vehicle_id=vehicle_id)


def _recalculate_service_due_for_vehicle(db: Session, vehicle_id: int) -> None:
    """Recalculate the service-due status for the given vehicle based on current schedules."""
    result = db.execute(
        text(
            """
            SELECT MIN(scheduled_date) AS next_service_date
            FROM schedules
            WHERE vehicle_id = :vehicle_id
            """
        ),
        {"vehicle_id": vehicle_id},
    )
    row = result.mappings().first()
    next_service_date = row["next_service_date"] if row else None

    db.execute(
        text(
            """
            UPDATE vehicles
            SET next_service_date = :next_service_date
            WHERE id = :vehicle_id
            """
        ),
        {"next_service_date": next_service_date, "vehicle_id": vehicle_id},
    )
    db.commit()
