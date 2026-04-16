from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.daily_log import DailyLog
from app.models.user import User
from app.schemas.daily_log import DailyLogCreate
from app.utils.rules import calculate_workout_calories

router = APIRouter()


@router.post("/")
def create_log(payload: DailyLogCreate, db: Session = Depends(get_db)):
    # Check if a log already exists for this user and date
    existing_log = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == payload.user_id, DailyLog.date == payload.date)
        .first()
    )

    if existing_log:
        # Update existing log
        payload_data = payload.dict()
        
        # 1. Handle steps (Add or Replace)
        if payload_data.get("is_delta", True):
            existing_log.steps = (existing_log.steps or 0) + payload_data["steps"]
        else:
            existing_log.steps = payload_data["steps"]
        
        # 2. Update other fields
        existing_log.workout_done = existing_log.workout_done or payload_data["workout_done"]
        if payload_data["workout_type"]:
            existing_log.workout_type = payload_data["workout_type"]
        if payload_data["workout_duration"]:
            existing_log.workout_duration = payload_data["workout_duration"]
            
        existing_log.energy_level = payload_data["energy_level"]
        if payload_data.get("meal"):
            existing_log.meal = payload_data["meal"]
        if payload_data.get("weight"):
            existing_log.weight = payload_data["weight"]
            # Sync to User profile
            db.query(User).filter(User.id == payload.user_id).update({"weight": payload_data["weight"]})
        
        db.commit()
        db.refresh(existing_log)
        return {"message": "Log updated", "total_steps": existing_log.steps}

    # Create new log
    payload_data = payload.dict()
    payload_data.pop("is_delta", None)
    log = DailyLog(**payload_data)
    db.add(log)
    
    if payload_data.get("weight"):
        # Sync to User profile
        db.query(User).filter(User.id == payload.user_id).update({"weight": payload_data["weight"]})

    db.commit()
    db.refresh(log)
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
            "calories": round((log.steps or 0) * 0.05) + calculate_workout_calories(log.workout_type, log.workout_duration),
            "workout": log.workout_done,
            "workout_type": log.workout_type,
            "workout_duration": log.workout_duration,
            "energy": log.energy_level,
            "weight": log.weight,
            "meal": log.meal,
        }
        for log in logs
    ]
