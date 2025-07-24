from fastapi import APIRouter, Request, HTTPException, status
from services.role_service import verify_token

router = APIRouter()

@router.get("/validate-role")
def validate_user_role(request: Request):
    token = request.cookies.get("access_token")  # Primero buscar en cookie
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            print(f"Token recibido en header Authorization: {token}")
            
    if not token:
        raise HTTPException(status_code=401, detail="Token no encontrado en cookie ni en header")

    user_data = verify_token(token)
    print("✅ Token verificado:", user_data)
    if not user_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")
    
    print("✅ Token verificado:", user_data)
    return {"email": user_data["email"], "role": user_data["role"]}