from pydantic import BaseModel
from typing import List, Optional
from fastapi import Form

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
    nome: str
    registro_academico: str

class AlunoCreate(AlunoBase):
    pass

class Aluno(AlunoBase):
    id: int

    class Config:
        orm_mode = True

class PresencaBase(BaseModel):
    aluno_id: int
    oficina_id: int

class PresencaCreate(PresencaBase):
    pass

class Presenca(PresencaBase):
    id: int

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