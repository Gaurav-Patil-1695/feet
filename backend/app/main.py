from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings


def create_application() -> FastAPI:
    application = FastAPI(
        title="Fleet Management API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from app.routers.auth import router as auth_router
    from app.routers.vehicles import router as vehicles_router
    from app.routers.service_due import router as service_due_router
    from app.routers.work_orders import router as work_orders_router
    from app.routers.schedules import router as schedules_router
    from app.routers.users import router as users_router
    from app.routers.vehicle_types import router as vehicle_types_router
    from app.routers.depots import router as depots_router

    application.include_router(auth_router, prefix="/auth", tags=["auth"])
    application.include_router(vehicles_router, prefix="/vehicles", tags=["vehicles"])
    application.include_router(service_due_router, prefix="/service-due", tags=["service-due"])
    application.include_router(work_orders_router, prefix="/work-orders", tags=["work-orders"])
    application.include_router(schedules_router, prefix="/schedules", tags=["schedules"])
    application.include_router(users_router, prefix="/users", tags=["users"])
    application.include_router(vehicle_types_router, prefix="/vehicle-types", tags=["vehicle-types"])
    application.include_router(depots_router, prefix="/depots", tags=["depots"])

    @application.get("/health", tags=["health"])
    async def health_check() -> dict:
        return {"status": "ok"}

    return application


app = create_application()
