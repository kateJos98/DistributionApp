from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from routers.login import router as login_router
from database import create_tables, get_db
from fastapi.middleware.cors import CORSMiddleware
from models.user import User
from services.hash_service import hash_password
from routers import protected_routes 
import threading
from kafka_consumer import consume_user_created, consume_user_deleted
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
if ENVIRONMENT == "development":
    origins = ["*"]
else:
    # 🛡️ SOLO tu frontend real en producción
    origins = ["https://mi-frontend.com"]

# CORS para permitir frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router, prefix="/auth")
app.include_router(protected_routes.router)

@app.on_event("startup")
def startup_event():
    create_tables()
    db = next(get_db())
    
    print("📥 Iniciando consumidor Kafka para customer_created")
    threading.Thread(target=consume_user_created, daemon=True).start()

    print("📥 Iniciando consumidor Kafka para customer_deleted")
    threading.Thread(target=consume_user_deleted, daemon=True).start()

    # Obtener datos desde .env
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")

    existing_admin = db.query(User).filter(User.username == admin_username).first()
    if not existing_admin:
        new_admin = User(
            username=admin_username,
            password=hash_password(admin_password),
            email=admin_email,
            role="admin"
        )
        db.add(new_admin)
        db.commit()
        print(f"✅ Usuario admin creado: {admin_username}")
    else:
        print("🟡 Usuario admin ya existe")
        
