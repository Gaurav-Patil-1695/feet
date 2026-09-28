from typing import List, Optional

from backend.app.api.v1.depots.schemas import DepotCreate, DepotUpdate, DepotRead


class DepotService:
    def __init__(self, db):
        self.db = db

    def get_depots(self) -> List[dict]:
        cursor = self.db.cursor()
        cursor.execute("SELECT id, name, location FROM depots ORDER BY id")
        rows = cursor.fetchall()
        return [self._row_to_dict(row) for row in rows]

    def get_depot(self, depot_id: int) -> Optional[dict]:
        cursor = self.db.cursor()
        cursor.execute("SELECT id, name, location FROM depots WHERE id = %s", (depot_id,))
        row = cursor.fetchone()
        if row is None:
            return None
        return self._row_to_dict(row)

    def create_depot(self, payload: DepotCreate) -> dict:
        cursor = self.db.cursor()
        cursor.execute(
            "INSERT INTO depots (name, location) VALUES (%s, %s) RETURNING id, name, location",
            (payload.name, payload.location),
        )
        row = cursor.fetchone()
        self.db.commit()
        return self._row_to_dict(row)

    def update_depot(self, depot_id: int, payload: DepotUpdate) -> Optional[dict]:
        existing = self.get_depot(depot_id)
        if existing is None:
            return None
        new_name = payload.name if payload.name is not None else existing["name"]
        new_location = payload.location if payload.location is not None else existing["location"]
        cursor = self.db.cursor()
        cursor.execute(
            "UPDATE depots SET name = %s, location = %s WHERE id = %s RETURNING id, name, location",
            (new_name, new_location, depot_id),
        )
        row = cursor.fetchone()
        self.db.commit()
        if row is None:
            return None
        return self._row_to_dict(row)

    def delete_depot(self, depot_id: int) -> bool:
        existing = self.get_depot(depot_id)
        if existing is None:
            return False
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM depots WHERE id = %s", (depot_id,))
        self.db.commit()
        return True

    @staticmethod
    def _row_to_dict(row) -> dict:
        if hasattr(row, "keys"):
            return dict(row)
        return {"id": row[0], "name": row[1], "location": row[2]}
