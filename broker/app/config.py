# variables de entorno y configuracion general
# agarre la misma logica del proyecto de helados para leer el .env
from pydantic_settings import BaseSettings, SettingsConfigDict

class Config(BaseSettings):
    # configuracion del token jwt
    secret_key: str = "clave_secreta_super_segura_lol_merch_2026"
    algoritmo: str = "HS256"
    minutos_expiracion: int = 30

    # urls de los otros dos microservicios
    url_ms_productos: str = "http://localhost:3001"
    url_ms_pedidos: str = "http://localhost:3003"

    # conexion a supabase
    database_url: str = ""
    db_host: str = "127.0.0.1"
    db_port: int = 5432
    db_usuario: str = "postgres"
    db_password: str = ""
    db_name: str = "postgres"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

config = Config()
