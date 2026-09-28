from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.schedule import Schedule


class ScheduleRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self) -> List[Schedule]:
        return self.db.query(Schedule).order_by(Schedule.id).all()

    def get_by_id(self, schedule_id: int) -> Optional[Schedule]:
        return self.db.query(Schedule).filter(Schedule.id == schedule_id).first()

    def create(self, schedule: Schedule) -> Schedule:
        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)
        return schedule

    def update(self, schedule: Schedule) -> Schedule:
        self.db.commit()
        self.db.refresh(schedule)
        return schedule

    def delete(self, schedule: Schedule) -> None:
        self.db.delete(schedule)
        self.db.commit()
