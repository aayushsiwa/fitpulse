from sqlalchemy import Column, String, Integer, Boolean, Date, Float
from app.core.database import Base
import uuid


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String)
    date = Column(Date)
    steps = Column(Integer)
    workout_done = Column(Boolean)
    workout_type = Column(String, nullable=True)
    workout_duration = Column(Integer, nullable=True)
    energy_level = Column(String)
    meal = Column(String, nullable=True)
    weight = Column(Float, nullable=True)
