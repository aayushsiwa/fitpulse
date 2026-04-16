from pydantic import BaseModel
from datetime import date


class RecommendationResponse(BaseModel):
    user_id: str
    date: date
    workout_type: str
    intensity: str
    duration_minutes: int
    tip: str
    step_goal: int
