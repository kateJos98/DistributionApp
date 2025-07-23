from fastapi import APIRouter, Cookie, HTTPException, status
from services.role_service import verify_token

router = APIRouter()

@router.get("/validate-role")
def validate_user_role(access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token no encontrado en cookie")
    user_data = verify_token(access_token)
    print("✅ Token verificado:", user_data)
    if not user_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")

    return {"email": user_data["email"], "role": user_data["role"]}