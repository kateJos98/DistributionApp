from fastapi import FastAPI
from routers import roles

app = FastAPI()
app.include_router(roles.router)