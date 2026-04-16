from pydantic import BaseModel
from datetime import date


class DailyLogCreate(BaseModel):
    user_id: str
    date: date
    steps: int
    workout_done: bool
    workout_type: str | None = None
    workout_duration: int | None = None
    energy_level: str
    meal: str | None = None
    weight: float | None = None
    is_delta: bool = True
