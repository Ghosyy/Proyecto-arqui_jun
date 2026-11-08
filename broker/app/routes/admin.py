# rutas de administracion
# solo accesibles para usuarios con rol admin
from fastapi import APIRouter, Depends, HTTPException

from app.db import buscar_usuario, cambiar_estado, listar_usuarios
from app.dependencies import solo_admin

# protege todas las rutas del router
router = APIRouter(
    prefix = "/admin", tags = ["Administración"], dependencies = [Depends(solo_admin)]
)

@router.get("/usuarios")
def listar():
    # devuelve todos los usuarios registrados
    return listar_usuarios()

@router.post("/usuarios/{usuario}/banear")
def banear(usuario: str):
    # verificar que exista el usuario antes de banearlo
    objetivo = buscar_usuario(usuario)
    if objetivo is None:
        raise HTTPException(status_code = 404, detail = f"No existe el usuario {usuario}")
    if objetivo["rol"] == "admin":
        raise HTTPException(status_code = 400, detail = "No se puede banear a un administrador")
    cambiar_estado(usuario, "baneado")
    return {"usuario": usuario, "estado": "baneado"}

@router.post("/usuarios/{usuario}/desbanear")
def desbanear(usuario: str):
    # reactivar usuario
    if buscar_usuario(usuario) is None:
        raise HTTPException(status_code = 404, detail = f"No existe el usuario {usuario}")
    cambiar_estado(usuario, "activo")
    return {"usuario": usuario, "estado": "activo"}
