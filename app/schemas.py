from pydantic import BaseModel
from typing import List, Optional
from fastapi import Form
from datetime import datetime

class ProfessorBase(BaseModel):
    nome: str
    email: str

class ProfessorCreate(ProfessorBase):
    password: str

class Professor(ProfessorBase):
    id: int

    class Config:
        orm_mode = True

class OficinaBase(BaseModel):
    titulo: str
    descricao: str
    professor_id: int
    

class OficinaCreate(OficinaBase):
    pass

class Oficina(OficinaBase):
    id: int
    professor_id: int

    class Config:
        orm_mode = True

class AlunoBase(BaseModel):
    registro_academico: int
    nome: str
    email: str
    telefone: Optional[str] = None

class AlunoCreate(AlunoBase):
    pass

class Aluno(AlunoBase):
    presencas: List["Presenca"] = []

    class Config:
        orm_mode = True

class PresencaBase(BaseModel):
    aluno_id: int  # Altere para o nome correto da coluna
    oficina_id: int

class PresencaCreate(PresencaBase):
    pass

class Presenca(PresencaBase):
    id: int  # Inclua o ID como resposta para consultas

    class Config:
        orm_mode = True
        
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProfessorForm(BaseModel):
    nome: str
    email: str
    password: str

class AlunoUpdate(BaseModel):
    nome: str
    email: str
    telefone: str