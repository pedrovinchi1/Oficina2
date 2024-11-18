from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from . import models, schemas, crud, database, auth

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    professor = auth.authenticate_professor(db, form_data.username, form_data.password)
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": professor.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/professores/", response_model=schemas.Professor)
def create_professor(professor: schemas.ProfessorCreate, db: Session = Depends(database.get_db)):
    db_professor = crud.get_professor_by_email(db, email=professor.email)
    if db_professor:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_professor(db=db, professor=professor)

@app.get("/professores/me", response_model=schemas.Professor)
def read_professor_me(current_professor: schemas.Professor = Depends(auth.get_current_professor)):
    return current_professor