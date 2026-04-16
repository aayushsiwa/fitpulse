from pydantic import BaseModel
from datetime import date


class DailyLogCreate(BaseModel):
    user_id: str
    date: date
    steps: int
    workout_done: bool
    energy_level: str
    mood: str
