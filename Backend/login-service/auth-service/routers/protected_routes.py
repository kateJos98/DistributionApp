from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_current_user

router = APIRouter()

@router.get("/admin/dashboard")
def admin_dashboard(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    return {"message": f"Bienvenido, administrador {user['sub']}"}

@router.get("/cliente/pedidos")
def cliente_pedidos(user: dict = Depends(get_current_user)):
    if user["role"] != "cliente":
        raise HTTPException(status_code=403, detail="No autorizado")
    return {"message": f"Pedidos del cliente {user['sub']}"}
