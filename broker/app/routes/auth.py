# rutas de autenticacion
# agarre la misma logica del login del proyecto de helados
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.db import buscar_usuario
from app.dependencies import usuario_actual
from app.passwords import verificar_password
from app.tokens import crear_token

router = APIRouter(prefix = "/auth", tags = ["Autenticación"])

class CredencialesLogin(BaseModel):
    usuario: str
    password: str

@router.post("/login")
def login(datos: CredencialesLogin):
    # buscamos el usuario en la base de datos
    usuario = buscar_usuario(datos.usuario)
    # mismo mensaje si no existe o clave mala para no dar pistas
    if usuario is None or not verificar_password(usuario["password_hash"], datos.password):
        raise HTTPException(status_code = 401, detail = "Usuario o contraseña incorrectos")
    # si esta baneado no lo dejamos entrar
    if usuario["estado"] == "baneado":
        raise HTTPException(status_code = 403, detail = "Usuario baneado")

    # generamos y devolvemos el token jwt
    token = crear_token(usuario["usuario"], usuario["rol"])
    return {"access_token": token, "token_type": "bearer"}

@router.get("/yo")
def quien_soy(usuario = Depends(usuario_actual)):
    # devuelve el perfil del usuario autenticado
    return {"usuario": usuario["usuario"], "rol": usuario["rol"], "estado": usuario["estado"]}
