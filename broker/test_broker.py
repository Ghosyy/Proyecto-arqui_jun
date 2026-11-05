from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("1. Probando GET /")
r = client.get("/")
print("Status:", r.status_code, "Body:", r.json())

print("\n2. Probando Login POST /auth/login (admin/admin123)")
r = client.post("/auth/login", json={"usuario": "admin", "password": "admin123"})
print("Status:", r.status_code)
token = r.json().get("access_token")
print("Token obtenido:", token[:20] + "...")

print("\n3. Probando GET /auth/yo con token")
r = client.get("/auth/yo", headers={"Authorization": f"Bearer {token}"})
print("Status:", r.status_code, "Body:", r.json())

print("\n4. Probando GET /admin/usuarios")
r = client.get("/admin/usuarios", headers={"Authorization": f"Bearer {token}"})
print("Status:", r.status_code, "Usuarios:", r.json())

print("\n5. Probando GET /productos SIN token (Debe dar 401)")
r = client.get("/productos")
print("Status:", r.status_code, "Detail:", r.json())

print("\n6. Probando GET /productos CON token (Debe dar 502 porque ms-productos aún no está levantado)")
r = client.get("/productos", headers={"Authorization": f"Bearer {token}"})
print("Status:", r.status_code, "Detail:", r.json())
