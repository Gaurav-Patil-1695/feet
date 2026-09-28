import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.v1.odometer_readings.schemas import (
    OdometerReadingCreate,
    OdometerReadingResponse,
    TelematicsIngestPayload,
    TelematicsIngestResponse,
    TelematicsMockPayload,
)


class OdometerReadingsService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _vehicle_exists(self, vehicle_id: str) -> bool:
        result = await self.db.execute(
            text("SELECT 1 FROM vehicles WHERE id = :vehicle_id LIMIT 1"),
            {"vehicle_id": vehicle_id},
        )
        return result.fetchone() is not None

    async def _insert_reading(
        self,
        vehicle_id: str,
        odometer_value: float,
        reading_date: datetime,
        source: Optional[str],
        notes: Optional[str],
        created_by: Optional[str],
    ) -> OdometerReadingResponse:
        reading_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc)

        await self.db.execute(
            text(
                """
                INSERT INTO odometer_readings
                    (id, vehicle_id, odometer_value, reading_date, source, notes, created_by, created_at)
                VALUES
                    (:id, :vehicle_id, :odometer_value, :reading_date, :source, :notes, :created_by, :created_at)
                """
            ),
            {
                "id": reading_id,
                "vehicle_id": vehicle_id,
                "odometer_value": odometer_value,
                "reading_date": reading_date,
                "source": source,
                "notes": notes,
                "created_by": created_by,
                "created_at": created_at,
            },
        )
        await self.db.commit()

        await self._update_vehicle_latest_odometer(vehicle_id, odometer_value)
        await self._refresh_vehicle_service_due_mv(vehicle_id)

        return OdometerReadingResponse(
            id=reading_id,
            vehicle_id=vehicle_id,
            odometer_value=odometer_value,
            reading_date=reading_date,
            source=source,
            notes=notes,
            created_by=created_by,
            created_at=created_at,
        )

    async def _update_vehicle_latest_odometer(
        self, vehicle_id: str, odometer_value: float
    ) -> None:
        """Update the vehicle's current_odometer if the new value is greater."""
        await self.db.execute(
            text(
                """
                UPDATE vehicles
                SET current_odometer = :odometer_value
                WHERE id = :vehicle_id
                  AND (current_odometer IS NULL OR current_odometer < :odometer_value)
                """
            ),
            {"vehicle_id": vehicle_id, "odometer_value": odometer_value},
        )
        await self.db.commit()

    async def _refresh_vehicle_service_due_mv(self, vehicle_id: str) -> None:
        """Refresh the vehicle_service_due materialized view for the given vehicle.

        If the database uses a materialized view, a full REFRESH is issued.
        Errors during refresh are silently swallowed so that the main operation
        still succeeds even if the view does not exist yet in the environment.
        """
        try:
            await self.db.execute(
                text("REFRESH MATERIALIZED VIEW CONCURRENTLY vehicle_service_due_mv")
            )
            await self.db.commit()
        except Exception:
            await self.db.rollback()

    # ------------------------------------------------------------------
    # Service due calculation helper (called after every insert)
    # ------------------------------------------------------------------

    async def _calculate_service_due(self, vehicle_id: str) -> None:
        """Invoke the service_due calculation logic by updating the vehicles row.

        The actual calculation is performed inside the database via triggers or
        the materialized view refresh.  This method is kept as an extension
        point so that additional Python-side logic can be added later.
        """
        # Delegate entirely to the MV refresh that was already called.
        pass

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def create_odometer_reading(
        self,
        vehicle_id: str,
        payload: OdometerReadingCreate,
        created_by: Optional[str] = None,
    ) -> Optional[OdometerReadingResponse]:
        if not await self._vehicle_exists(vehicle_id):
            return None

        return await self._insert_reading(
            vehicle_id=vehicle_id,
            odometer_value=payload.odometer_value,
            reading_date=payload.reading_date,
            source=payload.source or "manual",
            notes=payload.notes,
            created_by=created_by,
        )

    async def list_odometer_readings(
        self, vehicle_id: str
    ) -> Optional[List[OdometerReadingResponse]]:
        if not await self._vehicle_exists(vehicle_id):
            return None

        result = await self.db.execute(
            text(
                """
                SELECT id, vehicle_id, odometer_value, reading_date,
                       source, notes, created_by, created_at
                FROM odometer_readings
                WHERE vehicle_id = :vehicle_id
                ORDER BY reading_date DESC
                """
            ),
            {"vehicle_id": vehicle_id},
        )
        rows = result.fetchall()
        return [
            OdometerReadingResponse(
                id=str(row.id),
                vehicle_id=str(row.vehicle_id),
                odometer_value=row.odometer_value,
                reading_date=row.reading_date,
                source=row.source,
                notes=row.notes,
                created_by=str(row.created_by) if row.created_by else None,
                created_at=row.created_at,
            )
            for row in rows
        ]

    async def get_odometer_reading(
        self, vehicle_id: str, reading_id: str
    ) -> Optional[OdometerReadingResponse]:
        result = await self.db.execute(
            text(
                """
                SELECT id, vehicle_id, odometer_value, reading_date,
                       source, notes, created_by, created_at
                FROM odometer_readings
                WHERE id = :reading_id AND vehicle_id = :vehicle_id
                LIMIT 1
                """
            ),
            {"reading_id": reading_id, "vehicle_id": vehicle_id},
        )
        row = result.fetchone()
        if row is None:
            return None

        return OdometerReadingResponse(
            id=str(row.id),
            vehicle_id=str(row.vehicle_id),
            odometer_value=row.odometer_value,
            reading_date=row.reading_date,
            source=row.source,
            notes=row.notes,
            created_by=str(row.created_by) if row.created_by else None,
            created_at=row.created_at,
        )

    async def ingest_telematics(
        self, payload: TelematicsIngestPayload
    ) -> TelematicsIngestResponse:
        processed = 0
        skipped = 0
        errors: List[str] = []

        for entry in payload.readings:
            try:
                if not await self._vehicle_exists(entry.vehicle_id):
                    skipped += 1
                    errors.append(
                        f"Vehicle not found: {entry.vehicle_id}"
                    )
                    continue

                await self._insert_reading(
                    vehicle_id=entry.vehicle_id,
                    odometer_value=entry.odometer_value,
                    reading_date=entry.reading_date,
                    source=entry.source or "telematics",
                    notes=None,
                    created_by=None,
                )
                processed += 1
            except Exception as exc:  # noqa: BLE001
                skipped += 1
                errors.append(
                    f"Failed to ingest reading for vehicle {entry.vehicle_id}: {exc}"
                )

        return TelematicsIngestResponse(
            processed=processed,
            skipped=skipped,
            errors=errors,
        )

    async def ingest_telematics_mock(
        self, payload: TelematicsMockPayload
    ) -> TelematicsIngestResponse:
        processed = 0
        skipped = 0
        errors: List[str] = []

        for entry in payload.readings:
            try:
                if not await self._vehicle_exists(entry.vehicle_id):
                    skipped += 1
                    errors.append(
                        f"Vehicle not found: {entry.vehicle_id}"
                    )
                    continue

                reading_date = entry.reading_date or datetime.now(timezone.utc)

                await self._insert_reading(
                    vehicle_id=entry.vehicle_id,
                    odometer_value=entry.odometer_value,
                    reading_date=reading_date,
                    source="telematics-mock",
                    notes=None,
                    created_by=None,
                )
                processed += 1
            except Exception as exc:  # noqa: BLE001
                skipped += 1
                errors.append(
                    f"Failed to ingest mock reading for vehicle {entry.vehicle_id}: {exc}"
                )

        return TelematicsIngestResponse(
            processed=processed,
            skipped=skipped,
            errors=errors,
        )
