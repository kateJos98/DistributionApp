from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import Base, engine, get_db
from models.user import User
from schemas.user_schema import LoginRequest
from services.jwt_service import create_access_token

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print("⏳ Creando tablas...")
Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas correctamente.")

@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token = create_access_token({"sub": user.email, "role": user.role})

    # Poner token JWT en cookie segura y HttpOnly
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,            # Solo para HTTPS en producción
        samesite="None",         # Para prevenir CSRF en cierto nivel
        max_age=60*60*24 * 7    # duración de la cookie, 7 días
    )

    return {
        "message": "Inicio de sesión exitoso",
        "email": user.email,
        "role": user.role
    }
