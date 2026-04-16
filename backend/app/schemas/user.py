from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    email: str
    is_onboarded: bool = False


class UserMetrics(BaseModel):
    age: int
    gender: str
    fitness_level: str
    goal: str
    height: int
    weight: int
    target_weight: int | None = None


class UserCreate(UserMetrics):
    name: str


class UserSignup(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(UserBase, UserMetrics):
    id: str
    # Make metrics optional for the response (for when not onboarded)
    age: int | None = None
    gender: str | None = None
    fitness_level: str | None = None
    goal: str | None = None
    height: int | None = None
    weight: int | None = None
    target_weight: int | None = None
