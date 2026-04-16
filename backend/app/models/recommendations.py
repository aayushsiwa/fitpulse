from sqlalchemy import Column, String, Integer, Date
from app.core.database import Base
import uuid


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String)
    date = Column(Date)
    workout_type = Column(String)
    intensity = Column(String)
    duration_minutes = Column(Integer)
