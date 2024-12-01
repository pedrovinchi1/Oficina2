from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Professor(Base):
    __tablename__ = "professores"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, name="senha_hash")
    oficinas = relationship("Oficina", back_populates="professor")  

class Oficina(Base):
    __tablename__ = "oficinas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descricao = Column(String)
    professor_id = Column(Integer, ForeignKey("professores.id"))
    professor = relationship("Professor", back_populates="oficinas")
    presencas = relationship("Presenca", back_populates="oficina") 

class Aluno(Base):
    __tablename__ = "alunos"
    registro_academico = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    telefone = Column(String)
    presencas = relationship("Presenca", back_populates="aluno")

class Presenca(Base):
    __tablename__ = "presencas"
    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("alunos.registro_academico"))
    oficina_id = Column(Integer, ForeignKey("oficinas.id"))
    aluno = relationship("Aluno", back_populates="presencas")  
    oficina = relationship("Oficina", back_populates="presencas") 