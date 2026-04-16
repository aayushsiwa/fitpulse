from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.daily_log import DailyLog
from app.services.recommendation import create_recommendation

router = APIRouter()


@router.get("/{user_id}")
def get_recommendation(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    log = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == user_id)
        .order_by(DailyLog.date.desc())
        .first()
    )

    if not user or not log:
        return {"error": "Missing data"}

    return create_recommendation(user, log)
