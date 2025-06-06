from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from models.user import User
from schemas.login_schema import UserCreate, LoginRequest
from services.jwt_service import verify_token, create_jwt
from services.hash_service import hash_password, verify_password
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

router = APIRouter()

@router.post("/create-user")
def create_user(user_data: UserCreate, authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    return {"message": "Usuario creado exitosamente"}

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = create_jwt(user)
    return {"access_token": token, "token_type": "bearer"}
