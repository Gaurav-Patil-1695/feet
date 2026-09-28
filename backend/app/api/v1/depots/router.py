from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from backend.app.dependencies import get_db
from backend.app.api.v1.depots.schemas import DepotRead
from backend.app.api.v1.depots.service import DepotService

router = APIRouter(prefix="/depots", tags=["depots"])


@router.get("", response_model=List[DepotRead], status_code=status.HTTP_200_OK)
def get_depots(db=Depends(get_db)):
    service = DepotService(db)
    return service.get_depots()


@router.get("/{depotId}", response_model=DepotRead, status_code=status.HTTP_200_OK)
def get_depot(depotId: int, db=Depends(get_db)):
    service = DepotService(db)
    depot = service.get_depot(depotId)
    if depot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Depot not found")
    return depot
