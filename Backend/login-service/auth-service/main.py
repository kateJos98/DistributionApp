from fastapi import FastAPI
from database import create_tables, get_db
from routers import login
from models.user import User
from services.jwt_service import hash_password
import os

app = FastAPI()

app.include_router(login.router, prefix="/auth", tags=["Login"])

@app.on_event("startup")
def startup_event():
    create_tables()
    db = next(get_db())
    
    # Crear admin con credenciales desde .env si no existe
    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")

    existing_admin = db.query(User).filter(User.username == admin_username).first()
    if not existing_admin:
        new_admin = User(
            username=admin_username,
            password=hash_password(admin_password),
            role="admin"
        )
        db.add(new_admin)
        db.commit()
        print(f"✅ Usuario admin creado: {admin_username}")
    else:
        print("🟡 Usuario admin ya existe")
