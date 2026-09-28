from fastapi import APIRouter

from backend.app.api.v1.endpoints.auth import router as auth_router
from backend.app.api.v1.endpoints.vehicles import router as vehicles_router
from backend.app.api.v1.endpoints.service_due import router as service_due_router
from backend.app.api.v1.endpoints.work_orders import router as work_orders_router
from backend.app.api.v1.endpoints.users import router as users_router
from backend.app.api.v1.endpoints.schedules import router as schedules_router
from backend.app.api.v1.endpoints.vehicle_types import router as vehicle_types_router
from backend.app.api.v1.endpoints.depots import router as depots_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_v1_router.include_router(vehicles_router, prefix="/vehicles", tags=["vehicles"])
api_v1_router.include_router(
    service_due_router, prefix="/service-due", tags=["service-due"]
)
api_v1_router.include_router(
    work_orders_router, prefix="/work-orders", tags=["work-orders"]
)
api_v1_router.include_router(users_router, prefix="/users", tags=["users"])
api_v1_router.include_router(
    schedules_router, prefix="/schedules", tags=["schedules"]
)
api_v1_router.include_router(
    vehicle_types_router, prefix="/vehicle-types", tags=["vehicle-types"]
)
api_v1_router.include_router(depots_router, prefix="/depots", tags=["depots"])
