from fastapi import FastAPI
from routers import roles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

app = FastAPI()
if ENVIRONMENT == "development":
    origins = ["http://localhost:5174/"]
else:
    # REEMPLAZAR con dominio real del frontend
    origins = ["http://localhost:5174/"]
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roles.router)

