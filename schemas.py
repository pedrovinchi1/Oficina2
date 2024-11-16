from pydantic import BaseModel
from typing import List, Optional

class ProfessorBase(BaseModel):
    nome: str
    email: str

class ProfessorCreate(ProfessorBase):
    password: str

class Professor(ProfessorBase):
    id: int

    class Config:
        orm_mode = True
