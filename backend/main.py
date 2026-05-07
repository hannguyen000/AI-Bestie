from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from fastapi.middleware.cors import CORSMiddleware

import models, schemas

#if database tables don't exist, create them
models.Base.metadata.create_all(bind=engine)

# create FastAPI app, title will appear in the auto-generated docs at /docs
app = FastAPI(title="AI Bestie API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# simple route to check if the API is working (host by Railway)
@app.get("/")
def home():
    return {"message": "Welcome to AI Bestie API!"}

@app.get("/health")
def check_health(db: Session = Depends(get_db)):
    # simple query to check if the database connection is working
    return {"status": "Database connection is working!"}

# API endpoint to register a new user, receive data from frontend, validate it, and store it in the database
@app.post("/register", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # check if the username already exists in the database to prevent duplicates
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists!")
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already exists!")
    
    
    # create new user
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user