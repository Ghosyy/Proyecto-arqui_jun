-- ====================================================================
-- SCRIPT DE INICIALIZACIÓN COMPLETA PARA SUPABASE (POSTGRESQL)
-- Proyecto: Ecosistema Microservicios LoL Merch - Arquitectura de Sistemas
-- Pégalo y ejecútalo directamente en el SQL Editor de tu proyecto en Supabase
-- ====================================================================

-- 1. CREACIÓN DE LOS 3 ESQUEMAS INDEPENDIENTES (Cumple con la separación por servicio)
CREATE SCHEMA IF NOT EXISTS broker;
CREATE SCHEMA IF NOT EXISTS productos;
CREATE SCHEMA IF NOT EXISTS pedidos;

-- ====================================================================
-- ESQUEMA 1: BROKER (Autenticación, Usuarios y Roles)
-- ====================================================================
CREATE TABLE IF NOT EXISTS broker.usuarios (
    usuario VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
    estado VARCHAR(20) NOT NULL DEFAULT 'activo'
);

-- Usuarios iniciales con contraseñas hasheadas (admin123, faker123, caps123)
INSERT INTO broker.usuarios (usuario, password_hash, rol, estado)
VALUES
    ('admin', '825c9a65275e12d764f57f15c7b1d43f$cf112ab6675937f009c611084ed8d4c3923a8486732ac48a88b1b330c5d32682', 'admin', 'activo'),
    ('faker', '228ae91e408d047dd3e7a73eb1abde0b$78e430e42fbdd611c16021de3350cf35b5e6e172fe03d4f97146616550d3eacb', 'usuario', 'activo'),
    ('caps', 'df403ce30764cfced9e2d6ec1c780b98$194ff8f9ea405e94b143245ef64e96578626a385f275d86af61131bbaded26fc', 'usuario', 'activo')
ON CONFLICT (usuario) DO NOTHING;

-- ====================================================================
-- ESQUEMA 2: PRODUCTOS (Catálogo y Stock)
-- ====================================================================
CREATE TABLE IF NOT EXISTS productos.productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    existencia INT NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'DISPONIBLE'
);

-- 15 Productos oficiales de Riot Games Merch
INSERT INTO productos.productos (codigo, nombre, descripcion, precio, existencia, categoria, estado)
VALUES
    ('RIOT-FIG-001', 'Estatua Unlocked Faker (Hall of Legends Ahri)', 'Estatua conmemorativa de colección del Rey Demonio Inmortal Faker, escala 1/6 con base iluminada', 499.99, 3, 'Edición Worlds', 'DISPONIBLE'),
    ('RIOT-CLO-001', 'Chaqueta Bomber Worlds 2026 Anthem Edition', 'Chaqueta bomber oficial del Mundial de LoL con parches bordados y forro térmico premium', 135.00, 15, 'Ropa', 'DISPONIBLE'),
    ('RIOT-PLU-001', 'Peluche de Poro Esponjoso con Bigote', 'Peluche supersuave de Poro con lengüita afuera y bigote estilo Braum. Mide 25cm', 28.00, 80, 'Peluches', 'DISPONIBLE'),
    ('RIOT-FIG-002', 'Estatua Unlocked Jinx Arcane', 'Figura oficial de Jinx con su lanzacohetes Fishbones y detalles de grafiti reactivos a luz UV', 90.00, 20, 'Figuras', 'DISPONIBLE'),
    ('RIOT-ACC-001', 'Réplica de la Copa del Invocador (Summoner''s Cup)', 'Réplica de metal macizo en miniatura de la legendaria Copa del Invocador con base de mármol', 65.00, 10, 'Coleccionables Worlds', 'DISPONIBLE'),
    ('RIOT-CLO-002', 'Sudadera K/DA All Out con Capucha Holográfica', 'Sudadera de corte oversize con estampado holográfico de Akali y las integrantes de K/DA', 85.00, 35, 'Ropa', 'DISPONIBLE'),
    ('RIOT-FIG-003', 'Estatua Teemo Escuadrón Omega', 'Figura coleccionable de Teemo táctico con cerbatana, visor nocturno y base de selva', 85.00, 12, 'Figuras', 'DISPONIBLE'),
    ('RIOT-PLU-002', 'Peluche de Tibbers Gigante', 'El feroz oso de Annie en versión peluche gigante de 60cm con textura de pelaje realista', 55.00, 25, 'Peluches', 'DISPONIBLE'),
    ('RIOT-ACC-002', 'Mousepad XL Mapa de la Grieta del Invocador', 'Alfombrilla para ratón y teclado de 900x400mm con arte topográfico de Summoner''s Rift', 32.50, 50, 'Accesorios', 'DISPONIBLE'),
    ('RIOT-FIG-004', 'Figura Coleccionable Thresh Linterna Espectral', 'Figura articulada de Thresh carcelero con linterna que brilla en la oscuridad', 45.00, 18, 'Figuras', 'DISPONIBLE'),
    ('RIOT-CLO-003', 'Jersey Oficial T1 Worlds Championship 4-Stars', 'Camiseta oficial de competición del equipo T1 con las 4 estrellas doradas bordadas', 95.00, 8, 'Ropa', 'DISPONIBLE'),
    ('RIOT-ACC-003', 'Set de Pines Esmaltados de Roles (Top, Jg, Mid, Adc, Supp)', 'Estuche de lujo con 5 pines de metal esmaltado representando los roles de la Grieta', 22.00, 40, 'Accesorios', 'DISPONIBLE'),
    ('RIOT-FIG-005', 'Figura Chibi Yasuo Maestría 7 con Muro de Viento', 'Figura estilo chibi de Yasuo listo para tirar su ulti con efecto de tornado transparente', 35.00, 30, 'Figuras', 'DISPONIBLE'),
    ('RIOT-PLU-003', 'Peluche Poro con Galleta Poro-Snax', 'Poro edición especial abrazando una galleta crujiente Poro-Snax', 30.00, 60, 'Peluches', 'DISPONIBLE'),
    ('RIOT-CLO-004', 'Camiseta Pentakill III: Lost Chapter', 'Camiseta negra 100% algodón con arte de portada del álbum de la banda de metal Pentakill', 38.00, 45, 'Ropa', 'DISPONIBLE')
ON CONFLICT (codigo) DO NOTHING;

-- ====================================================================
-- ESQUEMA 3: PEDIDOS (Órdenes de Compra y Detalles)
-- ====================================================================
CREATE TABLE IF NOT EXISTS pedidos.pedidos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL UNIQUE,
    usuario VARCHAR(255) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estado VARCHAR(50) NOT NULL DEFAULT 'COMPLETADO'
);

CREATE TABLE IF NOT EXISTS pedidos.detalle_pedidos (
    id SERIAL PRIMARY KEY,
    "productoCodigo" VARCHAR(255) NOT NULL,
    "productoNombre" VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    "precioUnitario" NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    "pedidoId" INT REFERENCES pedidos.pedidos(id) ON DELETE CASCADE
);

-- ====================================================================
-- CONSULTA DE VERIFICACIÓN
-- ====================================================================
SELECT 'Usuarios en broker' AS tabla, COUNT(*) AS total FROM broker.usuarios
UNION ALL
SELECT 'Productos en catálogo' AS tabla, COUNT(*) AS total FROM productos.productos
UNION ALL
SELECT 'Pedidos realizados' AS tabla, COUNT(*) AS total FROM pedidos.pedidos;
