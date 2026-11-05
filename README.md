# Ecosistema de Microservicios - LoL Merch Ecommerce
**Curso:** Arquitectura de Sistemas I  
**Evaluación:** Proyecto Final (15 pts)  
**Universidad Mesoamericana**

---

## 🏛️ Arquitectura General

El sistema implementa una arquitectura orientada a microservicios con un **Broker / API Gateway** como único punto de entrada público, autenticación desacoplada con tokens Bearer JWT, y persistencia independiente por esquemas en PostgreSQL (Supabase):

```
                   [ Cliente / Postman / Móvil ]
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Broker / Gateway    │ (FastAPI - Puerto 3000)
                     │  - Autenticación JWT  │
                     │  - Chequeo baneo live │
                     │  - Header X-Usuario   │
                     └───────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
     ┌───────────────────────┐       ┌───────────────────────┐
     │     ms-productos      │       │      ms-pedidos       │
     │  (NestJS - Pto 3001)  │◄──────┤  (NestJS - Pto 3003)  │
     │  - Catálogo & Stock   │ HTTP  │  - Maestro / Detalle  │
     │  - Arquitectura MVC   │ Fetch │  - Capas completas    │
     └───────────┬───────────┘       └───────────┬───────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │   Supabase PostgreSQL   │
                    │   - broker.usuarios     │
                    │   - productos.productos │
                    │   - pedidos.pedidos     │
                    │   - pedidos.detalles    │
                    └─────────────────────────┘
```

---

## 🚀 Despliegue en Render

El repositorio cuenta con configuración para Render Blueprint (`render.yaml`) o configuración manual por servicio:

### Opción A: Render Blueprint (Recomendada - 1 Clic)
1. Conecta este repositorio en [Render Dashboard](https://dashboard.render.com/).
2. Haz clic en **New +** -> **Blueprint**.
3. Selecciona el repositorio. Render detectará automáticamente `render.yaml` y configurará los 3 servicios con sus variables de entorno enlazadas.

### Opción B: Configuración Manual (3 Web Services)
1. **ms-productos**:
   - **Root Directory:** `ms-productos`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Env Vars:**
     - `DATABASE_URL`: `postgresql://postgres.uuambhhxkpyztcpbhcue:TGZgMU79jpvPVh8a@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
     - `DB_SCHEMA`: `productos`

2. **ms-pedidos**:
   - **Root Directory:** `ms-pedidos`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Env Vars:**
     - `DATABASE_URL`: `postgresql://postgres.uuambhhxkpyztcpbhcue:TGZgMU79jpvPVh8a@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
     - `DB_SCHEMA`: `pedidos`
     - `URL_MS_PRODUCTOS`: URL pública de tu servicio `ms-productos` en Render (ej: `https://ms-productos-xxx.onrender.com`)

3. **broker** (El que expones al público / Postman):
   - **Root Directory:** `broker`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Env Vars:**
     - `SECRET_KEY`: `clave_secreta_super_segura_lol_merch_2026`
     - `ALGORITMO`: `HS256`
     - `MINUTOS_EXPIRACION`: `60`
     - `DATABASE_URL`: `postgresql://postgres.uuambhhxkpyztcpbhcue:TGZgMU79jpvPVh8a@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
     - `URL_MS_PRODUCTOS`: URL pública de `ms-productos`
     - `URL_MS_PEDIDOS`: URL pública de `ms-pedidos`

---

## 👤 Usuarios de Prueba Iniciales
| Usuario | Contraseña | Rol | Estado |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | `admin` | Activo |
| `faker` | `faker123` | `usuario` | Activo |
| `caps` | `caps123` | `usuario` | Activo |

---

## 🧪 Pruebas con Postman
Importa la colección `Broker_Ecommerce_LoL.postman_collection.json`. Solo cambia la variable `base_url` a tu dominio de Render del Broker (ej. `https://broker-lol.onrender.com`).
