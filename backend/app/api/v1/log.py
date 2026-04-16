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
