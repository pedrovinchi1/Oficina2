import pytest
from .utils import verify_password, get_password_hash

# app/test_utils.py


def test_verify_password_success():
    plain_password = "mysecretpassword"
    hashed_password = get_password_hash(plain_password)
    assert verify_password(plain_password, hashed_password) == True

def test_verify_password_failure():
    plain_password = "mysecretpassword"
    wrong_password = "wrongpassword"
    hashed_password = get_password_hash(plain_password)
    assert verify_password(wrong_password, hashed_password) == False

if __name__ == "__main__":
    pytest.main()