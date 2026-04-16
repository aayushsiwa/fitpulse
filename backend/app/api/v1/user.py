from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate

router = APIRouter()

@router.post("/{user_id}/onboard")
def onboard_user(user_id: str, payload: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    user.age = payload.age
    user.gender = payload.gender
    user.fitness_level = payload.fitness_level
    user.goal = payload.goal
    user.height = payload.height
    user.weight = payload.weight
    user.target_weight = payload.target_weight
    user.is_onboarded = True
    
    db.commit()
    db.refresh(user)
    return user

@router.get("/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
