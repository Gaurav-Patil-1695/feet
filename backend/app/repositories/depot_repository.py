from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.depot import Depot


class DepotRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[Depot]:
        return self.db.query(Depot).order_by(Depot.name).all()

    def get_by_id(self, depot_id: int) -> Optional[Depot]:
        return self.db.query(Depot).filter(Depot.id == depot_id).first()

    def get_by_name(self, name: str) -> Optional[Depot]:
        return self.db.query(Depot).filter(Depot.name == name).first()

    def create(self, depot: Depot) -> Depot:
        self.db.add(depot)
        self.db.commit()
        self.db.refresh(depot)
        return depot

    def update(self, depot: Depot) -> Depot:
        self.db.commit()
        self.db.refresh(depot)
        return depot

    def delete(self, depot: Depot) -> None:
        self.db.delete(depot)
        self.db.commit()
