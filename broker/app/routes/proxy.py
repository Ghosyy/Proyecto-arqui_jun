import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response

from app.config import config
from app.dependencies import usuario_actual

router = APIRouter()

METODOS = ["GET", "POST", "PUT", "PATCH", "DELETE"]

async def proxy_generico(
    request: Request,
    url_base: str,
    servicio_nombre: str,
    ruta: str,
    usuario: dict
) -> Response:
    destino = url_base
    if ruta:
        destino += f"/{ruta}"

    cabeceras = {"X-Usuario": usuario["usuario"]}
    if "content-type" in request.headers:
        cabeceras["Content-Type"] = request.headers["content-type"]

    try:
        async with httpx.AsyncClient(timeout = 10) as cliente:
            respuesta = await cliente.request(
                request.method,
                destino,
                params = request.query_params,
                content = await request.body(),
                headers = cabeceras
            )
    except httpx.ConnectError:
        raise HTTPException(
            status_code = 502,
            detail = f"{servicio_nombre} no está disponible"
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code = 504,
            detail = f"{servicio_nombre} tardó demasiado en responder"
        )

    return Response(
        content = respuesta.content,
        status_code = respuesta.status_code,
        media_type = respuesta.headers.get("content-type")
    )

def normalizar_url(base: str, path_esperado: str) -> str:
    url = base.strip().rstrip("/")
    if not url.startswith("http://") and not url.startswith("https://"):
        url = f"https://{url}"
    if not url.endswith(path_esperado):
        url = f"{url}{path_esperado}"
    return url

# --- Rutas hacia ms-productos ---
@router.api_route("/productos", methods = METODOS, tags = ["ms-productos"])
@router.api_route("/productos/{ruta:path}", methods = METODOS, tags = ["ms-productos"])
async def reenviar_a_productos(
    request: Request, ruta: str = "", usuario = Depends(usuario_actual)
):
    url_base = normalizar_url(config.url_ms_productos, "/productos")
    return await proxy_generico(
        request,
        url_base,
        "ms-productos",
        ruta,
        usuario
    )

# --- Rutas hacia ms-pedidos ---
@router.api_route("/pedidos", methods = METODOS, tags = ["ms-pedidos"])
@router.api_route("/pedidos/{ruta:path}", methods = METODOS, tags = ["ms-pedidos"])
async def reenviar_a_pedidos(
    request: Request, ruta: str = "", usuario = Depends(usuario_actual)
):
    url_base = normalizar_url(config.url_ms_pedidos, "/pedidos")
    return await proxy_generico(
        request,
        url_base,
        "ms-pedidos",
        ruta,
        usuario
    )
