# manejo de tokens jwt
# lo mismo que en el proyecto de helados pero adaptado a roles
from datetime import datetime, timedelta, timezone

import jwt

from app.config import config

def crear_token(usuario: str, rol: str) -> str:
    # creamos el payload con usuario y rol
    datos = {
        "sub": usuario,
        "rol": rol,
        "exp": datetime.now(timezone.utc) + timedelta(minutes = config.minutos_expiracion)
    }
    # firma del token con la secret key
    return jwt.encode(datos, config.secret_key, algorithm = config.algoritmo)

def leer_token(token: str) -> dict | None:
    # decodifica y valida firma y expiracion
    try:
        return jwt.decode(token, config.secret_key, algorithms = [config.algoritmo])
    except jwt.PyJWTError:
        # si esta vencido o alterado devuelve none
        return None
