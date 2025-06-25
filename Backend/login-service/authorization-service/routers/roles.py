from fastapi import APIRouter, Header, HTTPException, status
from services.role_service import verify_token

router = APIRouter()

@router.get("/validate-role")
def validate_user_role(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_data = verify_token(token)
    if not user_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    return {"email": user_data["email"], "role": user_data["role"]}