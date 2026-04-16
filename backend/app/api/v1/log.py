from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.daily_log import DailyLog
from app.schemas.daily_log import DailyLogCreate

router = APIRouter()


@router.post("/")
def create_log(payload: DailyLogCreate, db: Session = Depends(get_db)):
    log = DailyLog(**payload.dict())
    db.add(log)
    db.commit()
    return {"message": "Log saved"}


@router.get("/{user_id}")
def get_logs(user_id: str, db: Session = Depends(get_db)):
    logs = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == user_id)
        .order_by(DailyLog.date.asc())
        .limit(7)
        .all()
    )
    return [
        {
            "date": str(log.date),
            "steps": log.steps,
            "calories": round((log.steps or 0) * 0.06),
            "mood": log.mood,
            "workout": log.workout_done,
            "energy": log.energy_level,
        }
        for log in logs
    ]
