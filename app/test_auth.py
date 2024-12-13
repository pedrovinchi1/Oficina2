import pytest
from datetime import timedelta
from jose import jwt 
from fastapi import HTTPException, status
from  sqlalchemy.orm import Session
from app.auth import authenticate_professor, create_access_token, get_current_professor, SECRET_KEY, ALGORITHM
from app import model, schemas, utils

class MockSession:

    def __init__(self,professor):
        self.professor = professor  

    def query(self,model):
        return self
    
    def filter(self,*args):
        return self
    
    def first(self):
        return self.professor
    
class MockProfessor:
        def __init__(self,email,hashed_password):
            self.email = email
            self.hashed_password = hashed_password

@pytest.fixture
def mock_db():
    professor = MockProfessor(email="test@example.com", hashed_password=utils.get_password_hash("testpassword"))
    return MockSession(professor)

def test_authenticate_professor(mock_db):
    result= authenticate_professor(mock_db,"test@example.com","passwordo")
    assert result.email == "test@example.com"

def test_authenticate_professor_failure(mock_db):
    result = authenticate_professor(mock_db,"test@example.com","wrongpassword")
    assert resutl == False

def test_create_access_token():
    data = {"sub": "test@example.com"}
    token = create_acces_toke(data,expires_delta=timedelta(minutes=30))
    playload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    assert playload.get("sub") == "test@example.com"

@pytest.mark.asyncio
async def test_get_current_professor_failure(mock_db):
    token = create_access_token({"sub": "wrong@example.com"}, expires_delta=timedelta(minutes=30))
    with pytest.raises(HTTPException) as excinfo:
        await get_current_professor(token, mock_db)
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED

if __name__ == "__main__":
    pytest.main()