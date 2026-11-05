-- 🎮 Seed de Productos Oficiales de League of Legends & Worlds Merch
-- Base de datos: ecommerce_productos
-- Generado automáticamente para la demostración

USE ecommerce_productos;

INSERT INTO productos (codigo, nombre, descripcion, precio, existencia, categoria, estado)
VALUES
('RIOT-FIG-001', 'Estatua Unlocked Faker (Hall of Legends Ahri)', 'Estatua conmemorativa de colección del Rey Demonio Inmortal Faker, escala 1/6 con base iluminada.', 499.99, 3, 'Edición Worlds', 'DISPONIBLE'),
('RIOT-CLO-001', 'Chaqueta Bomber Worlds 2026 Anthem Edition', 'Chaqueta bomber oficial del Mundial de LoL con parches bordados y forro térmico premium.', 135, 15, 'Ropa', 'DISPONIBLE'),
('RIOT-PLU-001', 'Peluche de Poro Esponjoso con Bigote', 'Peluche supersuave de Poro con lengüita afuera y bigote estilo Braum. Mide 25cm.', 28, 80, 'Peluches', 'DISPONIBLE'),
('RIOT-FIG-002', 'Estatua Unlocked Jinx Arcane', 'Figura oficial de Jinx con su lanzacohetes Fishbones y detalles de grafiti reactivos a luz UV.', 90, 20, 'Figuras', 'DISPONIBLE'),
('RIOT-ACC-001', 'Réplica de la Copa del Invocador (Summoner\'s Cup)', 'Réplica de metal macizo en miniatura de la legendaria Copa del Invocador con base de mármol.', 65, 10, 'Coleccionables Worlds', 'DISPONIBLE'),
('RIOT-CLO-002', 'Sudadera K/DA All Out con Capucha Holográfica', 'Sudadera de corte oversize con estampado holográfico de Akali y las integrantes de K/DA.', 85, 35, 'Ropa', 'DISPONIBLE'),
('RIOT-FIG-003', 'Estatua Teemo Escuadrón Omega', 'Figura coleccionable de Teemo táctico con cerbatana, visor nocturno y base de selva.', 85, 12, 'Figuras', 'DISPONIBLE'),
('RIOT-PLU-002', 'Peluche de Tibbers Gigante', 'El feroz oso de Annie en versión peluche gigante de 60cm con textura de pelaje realista.', 55, 25, 'Peluches', 'DISPONIBLE'),
('RIOT-ACC-002', 'Mousepad XL Mapa de la Grieta del Invocador', 'Alfombrilla para ratón y teclado de 900x400mm con arte topográfico de Summoner\'s Rift.', 32.5, 50, 'Accesorios', 'DISPONIBLE'),
('RIOT-FIG-004', 'Figura Coleccionable Thresh Linterna Espectral', 'Figura articulada de Thresh carcelero con linterna que brilla en la oscuridad.', 45, 18, 'Figuras', 'DISPONIBLE'),
('RIOT-CLO-003', 'Jersey Oficial T1 Worlds Championship 4-Stars', 'Camiseta oficial de competición del equipo T1 con las 4 estrellas doradas bordadas.', 95, 8, 'Ropa', 'DISPONIBLE'),
('RIOT-ACC-003', 'Set de Pines Esmaltados de Roles (Top, Jg, Mid, Adc, Supp)', 'Estuche de lujo con 5 pines de metal esmaltado representando los roles de la Grieta.', 22, 40, 'Accesorios', 'DISPONIBLE'),
('RIOT-FIG-005', 'Figura Chibi Yasuo Maestría 7 con Muro de Viento', 'Figura estilo chibi de Yasuo listo para tirar su ulti con efecto de tornado transparente.', 35, 30, 'Figuras', 'DISPONIBLE'),
('RIOT-PLU-003', 'Peluche Poro con Galleta Poro-Snax', 'Poro edición especial abrazando una galleta crujiente Poro-Snax.', 30, 60, 'Peluches', 'DISPONIBLE'),
('RIOT-CLO-004', 'Camiseta Pentakill III: Lost Chapter', 'Camiseta negra 100% algodón con arte de portada del álbum de la banda de metal Pentakill.', 38, 45, 'Ropa', 'DISPONIBLE')
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio = VALUES(precio),
    existencia = VALUES(existencia),
    categoria = VALUES(categoria),
    estado = VALUES(estado);

SELECT COUNT(*) AS total_productos FROM productos;
