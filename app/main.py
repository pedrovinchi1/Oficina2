
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
async def create_professor(request: Request,nome: str = Form(...), email: str = Form(...), password: str = Form(...), db: Session = Depends(database.get_db)):
    db_professor = crud.get_professor_by_email(db, email=email)
    if db_professor:
        return templates.TemplateResponse("cadastroprofessor.html", {"request": request, "error": "Email already registered"})
    professor = schemas.ProfessorCreate(nome=nome, email=email, password=password)
    created_professor = crud.create_professor(db=db, professor=professor)
    token = auth.create_access_token(data={"sub": created_professor.email})
    response = templates.TemplateResponse("professorcadastrado.html", {"request": request, "professor": created_professor})
    response.set_cookie(key="access_token", value=f"Bearer {token}", httponly=True)
    return response


@app.get("/professores/", response_model=schemas.Professor)
async def create_professor(request: Request, professor: schemas.ProfessorCreate ,db: Session = Depends(database.get_db)):
    db_professor = crud.get_professor_by_email(db, email=professor.email)
    if db_professor:
        return templates.TemplateResponse("cadastroprofessor.html", {"request": request})
    return crud.create_professor(db=db, professor=professor)


@app.post("/oficinas/", response_model=schemas.Oficina)
async def create_oficina(oficina: schemas.OficinaCreate, db: Session = Depends(database.get_db), current_professor: schemas.Professor = Depends(auth.get_current_professor)):
    return crud.create_oficina(db=db, oficina=oficina, professor_id=current_professor.id)

@app.post("/presencas/", response_model=schemas.Presenca)
async def create_presenca(presenca: schemas.PresencaCreate, db: Session = Depends(database.get_db), current_professor: schemas.Professor = Depends(auth.get_current_professor)):
    db_aluno = crud.get_aluno(db, aluno_id=presenca.aluno_id)
    if not db_aluno:
        raise HTTPException(status_code=400, detail="Aluno not found")
    db_oficina = crud.get_oficina(db, oficina_id=presenca.oficina_id)
    if not db_oficina:
        raise HTTPException(status_code=400, detail="Oficina not found")
    return crud.create_presenca(db=db, presenca=presenca)

@app.post("/create-oficina")
async def create_oficina(request: Request, db: Session = Depends(database.get_db), titulo: str = Form(...), descricao: str = Form(...)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    current_professor = await auth.get_current_professor(token=token.split(" ")[1], db=db)
    new_oficina = models.Oficina(titulo=titulo, descricao=descricao, professor_id=current_professor.id)
    db.add(new_oficina)
    db.commit()
    db.refresh(new_oficina)
    return RedirectResponse(url="/oficinacadastrada", status_code=status.HTTP_302_FOUND)


@app.get("/consultaoficinas", response_model=List[schemas.Oficina])
async def read_oficinas(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    oficinas = crud.get_oficinas(db, skip=skip, limit=limit)
    return oficinas

@app.get("/oficinas", response_model=List[schemas.Oficina])
async def list_oficinas(db: Session = Depends(database.get_db)):
    oficinas = db.query(models.Oficina).all()
    return oficinas


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/cadastroprofessor", response_class=HTMLResponse)
async def create_professor(request: Request, db: Session = Depends(database.get_db), nome: str = Form(...), email: str = Form(...), senha: str = Form(...)):
    professor = models.Professor(nome=nome, email=email, hashed_password=auth.get_password_hash(senha))
    db.add(professor)
    db.commit()
    db.refresh(professor)
    return templates.TemplateResponse("professorcadastrado.html", {"request": request, "professor": professor})

@app.get("/cadastroprofessor", response_class=HTMLResponse)
async def read_cadastroprofessor(request: Request):
    return templates.TemplateResponse("cadastroprofessor.html", {"request": request})

 
@app.get("/cadastrooficina", response_class=HTMLResponse)
async def read_cadastrooficina(request: Request):
    return templates.TemplateResponse("cadastrooficina.html", {"request": request})


@app.get("/presenca", response_class=HTMLResponse)
async def read_presenca(request: Request):
    return templates.TemplateResponse("presenca.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def read_login_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/login")
async def login(request: Request, db: Session = Depends(database.get_db), email: str = Form(...), password: str = Form(...)):
    user = crud.authenticate_user(db, email, password)
    if not user:
        return templates.TemplateResponse("index.html", {"request": request, "error": "Invalid email or password"})
    token = auth.create_access_token(data={"sub": user.email})
    response = RedirectResponse(url="/dashboard", status_code=status.HTTP_302_FOUND)
    response.set_cookie(key="access_token", value=f"Bearer {token}", httponly=True)
    return response

@app.get("/dashboard", response_class=HTMLResponse)
async def read_dashboard(request: Request):
    token = request.cookies.get("access_token")
    return templates.TemplateResponse("dashboard.html", {"request": request,"token": token})  

@app.get("/oficinacadastrada", response_class=HTMLResponse)
async def read_oficinacadastrada(request: Request):
    return templates.TemplateResponse("oficinacadastrada.html", {"request": request})    

@app.get("/cadastroaluno", response_class=HTMLResponse)
async def read_cadastroaluno(request: Request):
    return templates.TemplateResponse("cadastroaluno.html", {"request": request})

@app.post("/alunos/", response_class=HTMLResponse)
async def create_aluno(request: Request, registro_academico: str = Form(...), nome: str = Form(...), email: str = Form(...), telefone: str = Form(...), db: Session = Depends(database.get_db)):
    db_aluno = crud.get_aluno_by_email(db, email=email)
    if db_aluno:
        return templates.TemplateResponse("cadastroaluno.html", {"request": request, "error": "Email already registered"})
    aluno = schemas.AlunoCreate(registro_academico=registro_academico, nome=nome, email=email, telefone=telefone)
    created_aluno = crud.create_aluno(db=db, aluno=aluno)
    return templates.TemplateResponse("alunocadastrado.html", {"request": request, "aluno": created_aluno})