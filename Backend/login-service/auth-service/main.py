from fastapi import FastAPI
from routers.login import router as login_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS para permitir frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router, prefix="/auth")
