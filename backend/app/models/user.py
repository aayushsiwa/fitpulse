from sqlalchemy import Column, String, Integer
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
