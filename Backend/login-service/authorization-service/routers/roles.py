from fastapi import APIRouter, Header, HTTPException
from services.role_service import verify_role

router = APIRouter()

@router.get("/validate-role")
def validate_role(required_role: str, authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Token inválido")

    token = authorization.split(" ")[1]
    if verify_role(token, required_role):
        return {"message": "Acceso permitido"}
    else:
        raise HTTPException(status_code=403, detail="Rol no autorizado")
