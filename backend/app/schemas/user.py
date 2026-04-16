from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    age: int
    gender: str
    fitness_level: str
    goal: str


class UserResponse(UserCreate):
    id: str
