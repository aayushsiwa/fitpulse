from sqlalchemy import Column, String, Integer, Boolean
from app.core.database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    fitness_level = Column(String)
    goal = Column(String)
    height = Column(Integer)
    weight = Column(Integer)
    target_weight = Column(Integer, nullable=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_onboarded = Column(Boolean, default=False)
