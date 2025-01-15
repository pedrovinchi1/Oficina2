from fastapi import Depends, Form, HTTPException
from sqlalchemy.orm import Session
from app import models
from app import schemas
from app.auth import authenticate_professor
from app.utils import get_password_hash, verify_password as utils_verify_password

def get_professor(db: Session, professor_id: int):
    return db.query(models.Professor).filter(models.Professor.id == professor_id).first()

def get_professor_by_email(db: Session, email: str):
    return db.query(models.Professor).filter(models.Professor.email == email).first()


def create_professor(db: Session, professor: schemas.ProfessorCreate):
    hashed_password = get_password_hash(professor.password)
    db_professor = models.Professor(nome=professor.nome, email=professor.email, hashed_password=hashed_password)
    db.add(db_professor)
    db.commit()
    db.refresh(db_professor)
    return db_professor


def get_oficinas(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Oficina).offset(skip).limit(limit).all()

def create_oficina(db: Session, oficina: schemas.OficinaCreate, professor_id: int):
    db_oficina = models.Oficina(**oficina.dict(), professor_id=professor_id)
    db.add(db_oficina)
    db.commit()
    db.refresh(db_oficina)
    return db_oficina

def get_aluno(db: Session, aluno_id: int):
    return db.query(models.Aluno).filter(models.Aluno.id == aluno_id).first()

def create_aluno(db: Session, aluno: schemas.AlunoCreate):
    db_aluno = models.Aluno(**aluno.dict())
    db.add(db_aluno)
    db.commit()
    db.refresh(db_aluno)
    return db_aluno

def create_presenca(db: Session, presenca: schemas.PresencaCreate):
    # Valida se a presença já foi registrada para o aluno na oficina
    db_presenca_existente = db.query(models.Presenca).filter(
        models.Presenca.registro_academico == presenca.aluno_id,
        models.Presenca.oficina_id == presenca.oficina_id
    ).first()

    if db_presenca_existente:
        raise HTTPException(status_code=400, detail="Presença já registrada para este aluno na oficina")

    # Criação da nova presença
    db_presenca = models.Presenca(
        registro_academico=presenca.aluno_id,
        oficina_id=presenca.oficina_id
    )
    db.add(db_presenca)
    db.commit()
    db.refresh(db_presenca)
    return db_presenca

def get_presenca(db: Session, oficina_id: int):
    return db.query(models.Presenca).filter(models.Presenca.oficina_id == oficina_id).all()


def authenticate_user(db: Session, email: str, password: str):
    return authenticate_professor(db, email, password)

def get_aluno(db: Session, registro_academico: str):
    return db.query(models.Aluno).filter(models.Aluno.registro_academico == registro_academico).first()

def get_aluno_by_email(db: Session, email: str):
    return db.query(models.Aluno).filter(models.Aluno.email == email).first()

def create_aluno(db: Session, aluno: schemas.AlunoCreate):
    db_aluno = models.Aluno(
        registro_academico=aluno.registro_academico,
        nome=aluno.nome,
        email=aluno.email,
        telefone=aluno.telefone
    )
    db.add(db_aluno)
    db.commit()
    db.refresh(db_aluno)
    return db_aluno

def get_aluno(db: Session, aluno_id: str):
    return db.query(models.Aluno).filter(models.Aluno.registro_academico == aluno_id).first()

def get_aluno_by_registro_academico(db: Session, registro_academico: int):
    return db.query(models.Aluno).filter(models.Aluno.registro_academico == registro_academico).first()

def update_aluno(db: Session, registro_academico: int, aluno_update: schemas.AlunoUpdate):
    aluno = get_aluno_by_registro_academico(db, registro_academico)
    if aluno is None:
        return None
    aluno.nome = aluno_update.nome
    aluno.email = aluno_update.email
    aluno.telefone = aluno_update.telefone
    db.commit()
    db.refresh(aluno)
    return aluno