# initial table's structure
from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    weight = Column(Float)
    height = Column(Float)
    age = Column(Integer)
    aura = Column(String)
    preferences = Column(JSON)  # store user preferences as JSON for flexibility
    avatar_url = Column(String, nullable=True,default="default-avatar.png")  # default avatar URL if not provided