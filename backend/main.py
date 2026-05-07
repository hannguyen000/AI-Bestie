from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db, engine, Base

#if database tables don't exist, create them
Base.metadata.create_all(bind=engine)

# create FastAPI app, title will appear in the auto-generated docs at /docs
app = FastAPI(title="AI Bestie API")

@app.get("/")
def home():
    return {"message": "Welcome to AI Bestie API!"}

@app.get("/health")
def check_health(db: Session = Depends(get_db)):
    # simple query to check if the database connection is workin
    return {"status": "Database connection is working!"}