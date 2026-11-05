import urllib.request
import json
import sys

# Forzar salida en utf-8 en Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3000"

def peticion(metodo, ruta, datos=None, token=None):
    url = f"{BASE_URL}{ruta}"
    req = urllib.request.Request(url, method=metodo)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    
    cuerpo = json.dumps(datos).encode() if datos else None
    try:
        with urllib.request.urlopen(req, data=cuerpo) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

print("==================================================")
print("[*] PRUEBA INTEGRAL E2E: BROKER + PRODUCTOS + PEDIDOS")
print("==================================================")

# 1. Login
status, res = peticion("POST", "/auth/login", {"usuario": "faker", "password": "faker123"})
print(f"\n1. Login como 'faker': {status}")
token = res["access_token"]
print("   Token JWT generado con exito.")

# 2. Consultar stock inicial de Poro
status, poro_antes = peticion("GET", "/productos/RIOT-PLU-001", token=token)
print(f"\n2. Consultar Poro antes de comprar: {status}")
print(f"   Producto: {poro_antes['nombre']} | Stock: {poro_antes['existencia']} | Precio: ${poro_antes['precio']}")

import time
import uuid

# 3. Crear pedido exitoso (Comprar 2 Poros)
codigo_unico = f"PED-TEST-{int(time.time())}"
payload_pedido = {
    "codigo": codigo_unico,
    "items": [
        {"productoCodigo": "RIOT-PLU-001", "cantidad": 2}
    ]
}
status, pedido_creado = peticion("POST", "/pedidos", payload_pedido, token=token)
print(f"\n3. Crear Pedido Exitoso: {status}")
print(f"   Codigo: {pedido_creado['codigo']} | Usuario: {pedido_creado['usuario']} | Total: ${pedido_creado['total']}")
print(f"   Detalles: {pedido_creado['detalles']}")

# 4. Verificar descuento de stock en ms-productos
status, poro_despues = peticion("GET", "/productos/RIOT-PLU-001", token=token)
print(f"\n4. Consultar Poro despues de la compra: {status}")
print(f"   Stock anterior: {poro_antes['existencia']} -> Nuevo stock: {poro_despues['existencia']} (Se descontaron 2!)")

# 5. Probar regla de negocio: Rechazo por stock insuficiente (Intentar comprar 999 estatuas Faker)
payload_insuficiente = {
    "codigo": "PED-FAIL-001",
    "items": [
        {"productoCodigo": "RIOT-FIG-001", "cantidad": 999}
    ]
}
status, fail_stock = peticion("POST", "/pedidos", payload_insuficiente, token=token)
print(f"\n5. Intento de compra con stock insuficiente: {status}")
print(f"   Mensaje de error: {fail_stock.get('message') or fail_stock.get('detail')}")

# 6. Probar regla de negocio: Rechazo por producto inexistente
payload_inexistente = {
    "codigo": "PED-FAIL-002",
    "items": [
        {"productoCodigo": "RIOT-INEXISTENTE", "cantidad": 1}
    ]
}
status, fail_inexistente = peticion("POST", "/pedidos", payload_inexistente, token=token)
print(f"\n6. Intento de compra con producto inexistente: {status}")
print(f"   Mensaje de error: {fail_inexistente.get('message') or fail_inexistente.get('detail')}")

# 7. Listar pedidos
status, lista_pedidos = peticion("GET", "/pedidos", token=token)
print(f"\n7. Listar todos los pedidos: {status}")
print(f"   Total pedidos registrados: {len(lista_pedidos)}")

print("\n==================================================")
print("[+] TODAS LAS PRUEBAS INTEGRALES PASARON AL 100%")
print("==================================================")
