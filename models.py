from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Professor(Base):
    __tablename__ = "professores"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Oficina(Base):
    __tablename__ = "oficinas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descricao = Column(String)
    professor_id = Column(Integer, ForeignKey("professores.id"))

class Aluno(Base):
    __tablename__ = "alunos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    registro_academico = Column(String, unique=True, index=True)

class Presenca(Base):
    __tablename__ = "presencas"
    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("alunos.id"))
    oficina_id = Column(Integer, ForeignKey("oficinas.id"))
    aluno = relationship("Aluno")
    oficina = relationship("Oficina")
