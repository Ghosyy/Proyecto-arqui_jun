import psycopg2
from psycopg2.extras import RealDictCursor

from app.config import config
from app.passwords import crear_password

def obtener_conexion():
    if config.database_url:
        return psycopg2.connect(
            config.database_url,
            cursor_factory = RealDictCursor
        )
    return psycopg2.connect(
        host = config.db_host,
        port = config.db_port,
        user = config.db_usuario,
        password = config.db_password,
        database = config.db_name,
        cursor_factory = RealDictCursor
    )

def crear_tablas_y_usuarios_iniciales() -> None:
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("CREATE SCHEMA IF NOT EXISTS broker;")
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS broker.usuarios (
                usuario VARCHAR(50) PRIMARY KEY,
                password_hash VARCHAR(255) NOT NULL,
                rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
                estado VARCHAR(20) NOT NULL DEFAULT 'activo'
            );
            """
        )
        cursor.execute("SELECT COUNT(*) AS total FROM broker.usuarios;")
        fila = cursor.fetchone()
        if fila["total"] == 0:
            iniciales = [
                ("admin", "admin123", "admin"),
                ("faker", "faker123", "usuario"),
                ("caps", "caps123", "usuario"),
            ]
            for usuario, password, rol in iniciales:
                cursor.execute(
                    "INSERT INTO broker.usuarios (usuario, password_hash, rol) VALUES (%s, %s, %s);",
                    (usuario, crear_password(password), rol)
                )
    conexion.commit()
    conexion.close()

def buscar_usuario(usuario: str):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT * FROM broker.usuarios WHERE usuario = %s;", (usuario,))
        fila = cursor.fetchone()
    conexion.close()
    return fila

def listar_usuarios():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT usuario, rol, estado FROM broker.usuarios ORDER BY usuario;")
        filas = cursor.fetchall()
    conexion.close()
    return filas

def cambiar_estado(usuario: str, estado: str) -> None:
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            "UPDATE broker.usuarios SET estado = %s WHERE usuario = %s;", (estado, usuario)
        )
    conexion.commit()
    conexion.close()
