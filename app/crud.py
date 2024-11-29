from fastapi import Depends, Form, HTTPException
from sqlalchemy.orm import Session
from app import models
from app import schemas
from app.utils import get_password_hash, verify_password

def get_professor(db: Session, professor_id: int):
    return db.query(models.Professor).filter(models.Professor.id == professor_id).first()

def get_professor_by_email(db: Session, email: str):
    return db.query(models.Professor).filter(models.Professor.email == email).first()

def verify_password(plain_password: str, hashed_password: str):
    return verify_password(plain_password,hashed_password)
    pass

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
    db_presenca = models.Presenca(**presenca.dict())
    db.add(db_presenca)
    db.commit()
    db.refresh(db_presenca)
    return db_presenca

def get_presencas(db: Session, oficina_id: int):
    return db.query(models.Presenca).filter(models.Presenca.oficina_id == oficina_id).all()
