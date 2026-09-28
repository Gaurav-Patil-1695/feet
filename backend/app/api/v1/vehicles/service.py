from typing import List, Optional

from sqlalchemy import select, update, delete, text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.v1.vehicles.schemas import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
)


class VehicleService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_vehicles(
        self,
        depot_id: Optional[int] = None,
        vehicle_type_id: Optional[int] = None,
    ) -> List[VehicleResponse]:
        query = text(
            """
            SELECT
                v.id,
                v.registration_number,
                v.vehicle_type_id,
                v.depot_id,
                v.year,
                v.make,
                v.model,
                v.current_odometer,
                v.created_at,
                v.updated_at
            FROM vehicles v
            JOIN depots d ON d.id = v.depot_id
            JOIN vehicle_types vt ON vt.id = v.vehicle_type_id
            WHERE
                (:depot_id IS NULL OR v.depot_id = :depot_id)
                AND (:vehicle_type_id IS NULL OR v.vehicle_type_id = :vehicle_type_id)
            ORDER BY v.id
            """
        )
        result = await self.db.execute(
            query,
            {"depot_id": depot_id, "vehicle_type_id": vehicle_type_id},
        )
        rows = result.mappings().all()
        return [VehicleResponse(**dict(row)) for row in rows]

    async def get_vehicle(self, vehicle_id: int) -> Optional[VehicleResponse]:
        query = text(
            """
            SELECT
                v.id,
                v.registration_number,
                v.vehicle_type_id,
                v.depot_id,
                v.year,
                v.make,
                v.model,
                v.current_odometer,
                v.created_at,
                v.updated_at
            FROM vehicles v
            JOIN depots d ON d.id = v.depot_id
            JOIN vehicle_types vt ON vt.id = v.vehicle_type_id
            WHERE v.id = :vehicle_id
            """
        )
        result = await self.db.execute(query, {"vehicle_id": vehicle_id})
        row = result.mappings().first()
        if row is None:
            return None
        return VehicleResponse(**dict(row))

    async def create_vehicle(self, payload: VehicleCreate) -> VehicleResponse:
        query = text(
            """
            INSERT INTO vehicles
                (registration_number, vehicle_type_id, depot_id, year, make, model, current_odometer)
            VALUES
                (:registration_number, :vehicle_type_id, :depot_id, :year, :make, :model, :current_odometer)
            RETURNING
                id, registration_number, vehicle_type_id, depot_id, year, make, model,
                current_odometer, created_at, updated_at
            """
        )
        result = await self.db.execute(
            query,
            {
                "registration_number": payload.registration_number,
                "vehicle_type_id": payload.vehicle_type_id,
                "depot_id": payload.depot_id,
                "year": payload.year,
                "make": payload.make,
                "model": payload.model,
                "current_odometer": payload.current_odometer,
            },
        )
        await self.db.commit()
        row = result.mappings().first()
        return VehicleResponse(**dict(row))

    async def update_vehicle(
        self, vehicle_id: int, payload: VehicleUpdate
    ) -> Optional[VehicleResponse]:
        existing = await self.get_vehicle(vehicle_id)
        if existing is None:
            return None

        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            return existing

        set_clauses = ", ".join(
            f"{key} = :{key}" for key in update_data.keys()
        )
        query = text(
            f"""
            UPDATE vehicles
            SET {set_clauses}, updated_at = NOW()
            WHERE id = :vehicle_id
            RETURNING
                id, registration_number, vehicle_type_id, depot_id, year, make, model,
                current_odometer, created_at, updated_at
            """
        )
        params = {**update_data, "vehicle_id": vehicle_id}
        result = await self.db.execute(query, params)
        await self.db.commit()
        row = result.mappings().first()
        if row is None:
            return None
        return VehicleResponse(**dict(row))

    async def delete_vehicle(self, vehicle_id: int) -> bool:
        existing = await self.get_vehicle(vehicle_id)
        if existing is None:
            return False

        query = text("DELETE FROM vehicles WHERE id = :vehicle_id")
        await self.db.execute(query, {"vehicle_id": vehicle_id})
        await self.db.commit()
        return True

    async def get_service_due_for_vehicle(self, vehicle_id: int):
        """
        Reads from vehicle_service_due_mv materialized view for a single vehicle.
        Returns raw mapping rows for use by other services/routers.
        """
        query = text(
            """
            SELECT *
            FROM vehicle_service_due_mv
            WHERE vehicle_id = :vehicle_id
            """
        )
        result = await self.db.execute(query, {"vehicle_id": vehicle_id})
        return result.mappings().all()

    async def get_all_service_due(self):
        """
        Reads from vehicle_service_due_mv materialized view for all vehicles.
        Returns raw mapping rows for use by other services/routers.
        """
        query = text(
            """
            SELECT
                vsm.*,
                v.registration_number,
                v.depot_id,
                v.vehicle_type_id,
                s.name AS schedule_name
            FROM vehicle_service_due_mv vsm
            JOIN vehicles v ON v.id = vsm.vehicle_id
            LEFT JOIN schedules s ON s.id = vsm.schedule_id
            ORDER BY vsm.due_date ASC
            """
        )
        result = await self.db.execute(query)
        return result.mappings().all()
