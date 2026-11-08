# punto de entrada principal del broker fastapi
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import config
from app.db import crear_tablas_y_usuarios_iniciales
from app.routes import admin, auth, proxy

@asynccontextmanager
async def ciclo_de_vida(app: FastAPI):
    # inicializa las tablas en supabase al arrancar
    crear_tablas_y_usuarios_iniciales()
    yield

# inicializamos la app con el ciclo de vida
app = FastAPI(title = "Broker LoL Merch Ecommerce", lifespan = ciclo_de_vida)

# incluimos los routers de auth, admin y proxy
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(proxy.router)

@app.get("/")
def root():
    # ruta base para comprobar que el broker este levantado
    return {
        "mensaje": "Broker LoL Merch Activo",
        "servicios": {
            "ms-productos": config.url_ms_productos,
            "ms-pedidos": config.url_ms_pedidos
        }
    }
