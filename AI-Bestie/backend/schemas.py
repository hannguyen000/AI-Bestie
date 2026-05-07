# check if the data sent from frontend is valid (with right format) and can be used to create a new user in the database
from pydantic import BaseModel
from typing import List, Optional

class UserCreate(BaseModel):
    username: str
    email: str
    weight: float
    height: float
    age: int
    aura: str
    preferences: List[str]

class UserResponse(UserCreate):
    id: int
    class Config:
        from_attributes = True