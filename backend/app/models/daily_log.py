from sqlalchemy import Column, String, Integer, Boolean, Date
from app.core.database import Base
import uuid


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String)
    date = Column(Date)
    steps = Column(Integer)
    workout_done = Column(Boolean)
    energy_level = Column(String)
    mood = Column(String)
