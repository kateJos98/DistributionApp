from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
from models.user import User
from services.jwt_service import create_access_token
import requests

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/auth/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # Aquí va la llamada al authorization-service para validar roles
    access_token = create_access_token({"sub": user.username, "role": user.role})
    response = requests.post("http://authorization-service:8002/validate-role", headers={
        "Authorization": f"Bearer {access_token}"
    })

    if response.status_code != 200:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.username,
        "role": user.role
    }