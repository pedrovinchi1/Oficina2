from typing import List
from fastapi import APIRouter, FastAPI, Depends, Form, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app import models, schemas, crud, database, auth


app = FastAPI()
router = APIRouter()

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
models.Base.metadata.create_all(bind=database.engine)


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    professor = auth.authenticate_professor(db, form_data.username, form_data.password)
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": professor.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/professores/", response_model=schemas.Professor)
async def create_professor(request: Request, nome: str = Form(...), email: str = Form(...), password: str = Form(...), db: Session = Depends(database.get_db)):
    db_professor = crud.get_professor_by_email(db, email=email)
    if db_professor:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_professor(db=db, professor=schemas.ProfessorCreate(nome=nome, email=email, password=password))

@app.post("/presencas/", response_model=schemas.Presenca)
async def create_presenca(
    presenca: schemas.PresencaCreate,
    db: Session = Depends(database.get_db),
    current_professor: schemas.Professor = Depends(auth.get_current_professor)
):
    db_aluno = crud.get_aluno(db, aluno_id=presenca.aluno_id)
    if not db_aluno:
        raise HTTPException(status_code=400, detail="Aluno not found")
    db_oficina = crud.get_oficina(db, oficina_id=presenca.oficina_id)
    if not db_oficina:
        raise HTTPException(status_code=400, detail="Oficina not found")
    return crud.create_presenca(db=db, presenca=presenca)

app.include_router(router)