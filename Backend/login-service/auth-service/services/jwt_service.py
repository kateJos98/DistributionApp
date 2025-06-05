import jwt
import os
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_jwt(user):
    payload = {
        "username": user.username,
        "role": user.role
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
