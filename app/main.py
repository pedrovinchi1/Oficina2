from typing import List
from fastapi import APIRouter, FastAPI, Depends, Form, HTTPException, Request, status, Query
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, JSONResponse as jsonify, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fpdf import FPDF

from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app import models, schemas, crud, database, auth
from app.database import get_db
import logging
from app.utils import get_password_hash

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens, ajuste conforme necessário
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

router = APIRouter()

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
models.Base.metadata.create_all(bind=database.engine)

logging.basicConfig(level=logging.INFO)

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


@app.post("/presencas/", response_class=HTMLResponse)
async def create_presenca(
    request: Request,
    oficina_id: int = Form(...),
    registro_academico: int = Form(...),
    db: Session = Depends(database.get_db)
):
    try:
        new_presenca = schemas.PresencaCreate(
            aluno_id=registro_academico,  # aluno_id no schema corresponde a registro_academico
            oficina_id=oficina_id
        )
        crud.create_presenca(db, new_presenca)
        return templates.TemplateResponse(
            "presencaregistrada.html",{"request": request,"message": "Presença registrada com sucesso!"},status_code=200)
    except HTTPException as e:
        return HTMLResponse(content=e.detail, status_code=e.status_code)
    except Exception as ex:
        logging.error(f"Erro ao registrar presença: {ex}")
        return HTMLResponse(content="Erro ao registrar presença.", status_code=500)



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
async def read_presenca(request: Request, db: Session = Depends(database.get_db)):
    oficinas = crud.get_oficinas(db)
    token = request.cookies.get("access_token")
    return templates.TemplateResponse("presenca.html", {"request": request, "oficinas": oficinas, "token": token})

@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

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

@router.get("/gerarcertificados", response_class=HTMLResponse)
async def read_gerarcertificados(request: Request):
    return templates.TemplateResponse("gerarcertificados.html", {"request": request})

@router.post("/consultar-presencas", response_class=HTMLResponse)
async def consultar_presencas(request: Request, registro_academico: int = Form(...), db: Session = Depends(database.get_db)):
    aluno = crud.get_aluno_by_registro_academico(db, registro_academico)
    if not aluno:
        return templates.TemplateResponse("gerarcertificados.html", {"request": request, "error": "Aluno não encontrado"})
    presencas = crud.get_presenca_by_aluno(db, registro_academico)
    return templates.TemplateResponse("gerarcertificados.html", {"request": request, "aluno": aluno, "presencas": presencas})

@router.post("/gerar-certificado", response_class=FileResponse)
async def gerar_certificado(request: Request, oficina_id: int = Form(...), registro_academico: int = Form(...), db: Session = Depends(database.get_db)):
    aluno = crud.get_aluno_by_registro_academico(db, registro_academico)
    oficina = crud.get_oficina(db, oficina_id)
    if not aluno or not oficina:
        raise HTTPException(status_code=404, detail="Aluno ou Oficina não encontrado")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Certificado de Participação", ln=True, align='C')
    pdf.ln(10)
    pdf.multi_cell(0, 10, txt=f"Certificamos que o aluno {aluno.nome}, registro acadêmico {aluno.registro_academico}, participou da oficina {oficina.titulo}.")
    pdf_file = f"certificado_{aluno.registro_academico}_{oficina.id}.pdf"
    pdf.output(pdf_file)

    return FileResponse(pdf_file, media_type='application/pdf', filename=pdf_file)

@app.get("/logout")
async def logout(request: Request):
    response = RedirectResponse(url="/")
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="other_cookie_if_any")  
    return response

@app.get("/aluno/{registro_academico}", response_class=JSONResponse)
async def get_aluno(registro_academico: int, db: Session = Depends(get_db)):
    aluno = crud.get_aluno_by_registro_academico(db, registro_academico)
    if aluno is None:
        return JSONResponse(status_code=404, content={"message": "Aluno não encontrado"})
    return aluno

@app.put("/aluno/{registro_academico}", response_class=JSONResponse)
async def update_aluno(registro_academico: int, aluno: schemas.AlunoUpdate, db: Session = Depends(get_db)):
    updated_aluno = crud.update_aluno(db, registro_academico, aluno)
    if updated_aluno is None:
        return JSONResponse(status_code=404, content={"message": "Aluno não encontrado"})
    return updated_aluno


@app.post("/update-oficina")
async def update_oficina(
    request: Request,
    oficina_id: int = Form(...),
    titulo: str = Form(...),
    descricao: str = Form(...),
    db: Session = Depends(database.get_db)
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    updated_oficina = crud.update_oficina(db, oficina_id, titulo, descricao)
    if updated_oficina is None:
        raise HTTPException(status_code=404, detail="Oficina não encontrada")
    
    return RedirectResponse(url="/oficinacadastrada", status_code=status.HTTP_302_FOUND)

@app.get("/oficina/{oficina_id}", response_model=schemas.Oficina)
async def get_oficina_by_id(oficina_id: int, db: Session = Depends(database.get_db)):
    oficina = crud.get_oficina(db, oficina_id)
    if oficina is None:
        raise HTTPException(status_code=404, detail="Oficina não encontrada")
    return oficina

@app.get("/professor/{professor_id}", response_class=JSONResponse)
async def get_professor(professor_id: int, db: Session = Depends(get_db)):
    professor = crud.get_professor(db, professor_id)
    if professor is None:
        return JSONResponse(status_code=404, content={"message": "Professor não encontrado"})
    return {"id": professor.id, "nome": professor.nome, "email": professor.email}

@app.post("/professor/update", response_class=HTMLResponse)
async def update_professor(
    request: Request,
    professor_id: int = Form(...),
    nome: str = Form(...),
    email: str = Form(...),
    senha: str = Form(...),
    db: Session = Depends(database.get_db)
):
    hashed_password = get_password_hash(senha)
    professor_update = schemas.ProfessorUpdate(
        nome=nome,
        email=email,
        hashed_password=hashed_password
    )
    try:
        updated_professor = crud.update_professor(db, professor_id, professor_update)
        if updated_professor is None:
            return templates.TemplateResponse(
                "atualizaprof.html",
                {"request": request, "error": "Professor não encontrado"}
            )
        return templates.TemplateResponse(
            "professoratualizado.html",
            {"request": request, "professor": updated_professor}
        )
    except HTTPException as e:
        if e.status_code == 400:
            return templates.TemplateResponse(
                "atualizaprof.html",
                {"request": request, "error": e.detail}
            )
        raise e

@app.get("/atuaizaprof", response_class=HTMLResponse)
async def read_atualizaprof(request: Request):
    return templates.TemplateResponse("atualizaprof.html", {"request": request})

@app.get("/professor/email/{email}", response_class=JSONResponse)
async def get_professor_by_email(email: str, db: Session = Depends(get_db)):
    professor = crud.get_professor_by_email(db, email)
    if professor is None:
        return JSONResponse(status_code=404, content={"message": "Professor não encontrado"})
    return {"id": professor.id, "nome": professor.nome, "email": professor.email}

@app.get("/atualizaaluno", response_class=HTMLResponse)
async def read_atualizaaluno(request: Request):
    return templates.TemplateResponse("atualizaaluno.html", {"request": request})

@app.post("/aluno/update", response_class=HTMLResponse)
async def update_aluno(
    request: Request,
    registro_academico: int = Form(...),
    nome: str = Form(...),
    email: str = Form(...),
    telefone: str = Form(...),
    db: Session = Depends(database.get_db)
):
    aluno_update = schemas.AlunoUpdate(nome=nome, email=email, telefone=telefone)
    updated_aluno = crud.update_aluno(db, registro_academico, aluno_update)
    if updated_aluno is None:
        return templates.TemplateResponse("atualizaaluno.html", {"request": request, "error": "Error ao atualizar aluno"})
    return templates.TemplateResponse("alunocadastrado.html", {"request": request, "aluno": updated_aluno})

@app.get("/alunos/nome/{nome}", response_class=JSONResponse)
async def get_alunos_por_nome(nome: str, db: Session = Depends(get_db)):
    alunos = crud.get_alunos_por_nome(db, nome)
    return alunos

app.include_router(router)