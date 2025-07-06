from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import Base, engine, get_db
from models.user import User
from schemas.user_schema import LoginRequest
from services.jwt_service import create_access_token
import requests

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print("⏳ Creando tablas...")
Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas correctamente.")

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token = create_access_token({"sub": user.email, "role": user.role})
   

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.username,
        "email":user.email,
        "role": user.role
    }