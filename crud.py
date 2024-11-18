from sqlalchemy.orm import Session
from . import models, schemas
from .utils import get_password_hash, verify_password

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