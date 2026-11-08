# hasheo de contraseñas con sal
# use la misma logica del proyecto de helados que hicimos
import hashlib
import hmac
import os

ITERACION = 200_000

def crear_password(password: str) -> str:
    # sal aleatoria para mayor seguridad
    decoy = os.urandom(16)
    hash_bytes = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode(),
        decoy,
        ITERACION)

    # guardamos la sal y el hash juntos separados por $
    password_completa = decoy.hex() + "$" + hash_bytes.hex()
    return password_completa

def verificar_password(passwordGuardada: str, password: str) -> bool:
    # agarramos la sal que se habia guardado
    decoy_hex, hash_hex = passwordGuardada.split("$")

    # se recalcula el hash con la misma sal
    hash_nuevo = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode(),
        bytes.fromhex(decoy_hex),
        ITERACION)

    # comparamos de forma segura para evitar timing attacks
    return hmac.compare_digest(hash_nuevo.hex(), hash_hex)
