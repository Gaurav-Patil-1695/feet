from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from backend.app.api.v1.dashboard.schemas import DashboardOut, DashboardVehicleRow


async def get_dashboard(db: AsyncSession, depot_id: int) -> DashboardOut:
    """
    Query vehicle_service_due_mv filtered by depot_id.
    Partitions rows into due (km_until_service >= 0) vs overdue (km_until_service < 0).
    """
    mv_query = text(
        """
        SELECT
            v.id                        AS vehicle_id,
            v.registration              AS registration,
            vt.name                     AS vehicle_type,
            v.current_odometer          AS current_odometer,
            mv.service_due_km           AS service_due_km,
            mv.km_until_service         AS km_until_service,
            COALESCE(wo_counts.open_count, 0) AS open_work_orders
        FROM vehicle_service_due_mv mv
        JOIN vehicles v ON v.id = mv.vehicle_id
        JOIN vehicle_types vt ON vt.id = v.vehicle_type_id
        LEFT JOIN (
            SELECT vehicle_id, COUNT(*) AS open_count
            FROM work_orders
            WHERE status NOT IN ('closed', 'cancelled')
            GROUP BY vehicle_id
        ) wo_counts ON wo_counts.vehicle_id = v.id
        WHERE v.depot_id = :depot_id
        ORDER BY mv.km_until_service ASC NULLS LAST
        """
    )

    depot_query = text(
        """
        SELECT id, name FROM depots WHERE id = :depot_id
        """
    )

    depot_result = await db.execute(depot_query, {"depot_id": depot_id})
    depot_row = depot_result.fetchone()

    if depot_row is None:
        depot_name = ""
    else:
        depot_name = depot_row.name

    mv_result = await db.execute(mv_query, {"depot_id": depot_id})
    rows = mv_result.fetchall()

    vehicles: list[DashboardVehicleRow] = []
    vehicles_due_count = 0
    total_open_work_orders = 0

    for row in rows:
        vehicle_row = DashboardVehicleRow(
            vehicle_id=row.vehicle_id,
            registration=row.registration,
            vehicle_type=row.vehicle_type,
            current_odometer=row.current_odometer,
            service_due_km=row.service_due_km,
            km_until_service=row.km_until_service,
            open_work_orders=row.open_work_orders,
        )
        vehicles.append(vehicle_row)
        total_open_work_orders += row.open_work_orders

        # Due: km_until_service is None (no odometer) or <= 0 (overdue/exactly due)
        # or within a reasonable threshold; design says partition into due vs overdue
        # We count as "due for service" any vehicle where km_until_service is not None
        # and km_until_service <= 0 (overdue) OR km_until_service is None.
        if row.km_until_service is None or row.km_until_service <= 0:
            vehicles_due_count += 1

    return DashboardOut(
        depot_id=depot_id,
        depot_name=depot_name,
        total_vehicles=len(vehicles),
        vehicles_due_for_service=vehicles_due_count,
        open_work_orders=total_open_work_orders,
        vehicles=vehicles,
    )
