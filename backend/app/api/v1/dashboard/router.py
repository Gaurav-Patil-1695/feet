from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.dependencies import get_db
from backend.app.api.v1.dashboard.schemas import DashboardResponse
from backend.app.api.v1.dashboard.service import get_dashboard

router = APIRouter()


@router.get("/depots/{depot_id}/dashboard", response_model=DashboardResponse)
async def get_depot_dashboard(
    depot_id: int,
    db: AsyncSession = Depends(get_db),
) -> DashboardResponse:
    return await get_dashboard(db=db, depot_id=depot_id)
