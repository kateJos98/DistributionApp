from fastapi import Header, HTTPException
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "tu_clave_secreta")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def get_current_user(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Contiene: {"sub": "usuario", "role": "admin" o "cliente"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
