// Script generador y sembrador de productos oficiales de League of Legends & Worlds Merch
// Ejecutar con: node seed.js

import { writeFileSync } from 'fs';

const productosLoL = [
    {
        codigo: 'RIOT-FIG-001',
        nombre: 'Estatua Unlocked Faker (Hall of Legends Ahri)',
        descripcion: 'Estatua conmemorativa de colección del Rey Demonio Inmortal Faker, escala 1/6 con base iluminada.',
        precio: 499.99,
        existencia: 3, // Stock muy limitado para probar compras límite
        categoria: 'Edición Worlds',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-CLO-001',
        nombre: 'Chaqueta Bomber Worlds 2026 Anthem Edition',
        descripcion: 'Chaqueta bomber oficial del Mundial de LoL con parches bordados y forro térmico premium.',
        precio: 135.00,
        existencia: 15,
        categoria: 'Ropa',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-PLU-001',
        nombre: 'Peluche de Poro Esponjoso con Bigote',
        descripcion: 'Peluche supersuave de Poro con lengüita afuera y bigote estilo Braum. Mide 25cm.',
        precio: 28.00,
        existencia: 80,
        categoria: 'Peluches',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-FIG-002',
        nombre: 'Estatua Unlocked Jinx Arcane',
        descripcion: 'Figura oficial de Jinx con su lanzacohetes Fishbones y detalles de grafiti reactivos a luz UV.',
        precio: 90.00,
        existencia: 20,
        categoria: 'Figuras',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-ACC-001',
        nombre: 'Réplica de la Copa del Invocador (Summoner\'s Cup)',
        descripcion: 'Réplica de metal macizo en miniatura de la legendaria Copa del Invocador con base de mármol.',
        precio: 65.00,
        existencia: 10,
        categoria: 'Coleccionables Worlds',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-CLO-002',
        nombre: 'Sudadera K/DA All Out con Capucha Holográfica',
        descripcion: 'Sudadera de corte oversize con estampado holográfico de Akali y las integrantes de K/DA.',
        precio: 85.00,
        existencia: 35,
        categoria: 'Ropa',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-FIG-003',
        nombre: 'Estatua Teemo Escuadrón Omega',
        descripcion: 'Figura coleccionable de Teemo táctico con cerbatana, visor nocturno y base de selva.',
        precio: 85.00,
        existencia: 12,
        categoria: 'Figuras',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-PLU-002',
        nombre: 'Peluche de Tibbers Gigante',
        descripcion: 'El feroz oso de Annie en versión peluche gigante de 60cm con textura de pelaje realista.',
        precio: 55.00,
        existencia: 25,
        categoria: 'Peluches',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-ACC-002',
        nombre: 'Mousepad XL Mapa de la Grieta del Invocador',
        descripcion: 'Alfombrilla para ratón y teclado de 900x400mm con arte topográfico de Summoner\'s Rift.',
        precio: 32.50,
        existencia: 50,
        categoria: 'Accesorios',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-FIG-004',
        nombre: 'Figura Coleccionable Thresh Linterna Espectral',
        descripcion: 'Figura articulada de Thresh carcelero con linterna que brilla en la oscuridad.',
        precio: 45.00,
        existencia: 18,
        categoria: 'Figuras',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-CLO-003',
        nombre: 'Jersey Oficial T1 Worlds Championship 4-Stars',
        descripcion: 'Camiseta oficial de competición del equipo T1 con las 4 estrellas doradas bordadas.',
        precio: 95.00,
        existencia: 8,
        categoria: 'Ropa',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-ACC-003',
        nombre: 'Set de Pines Esmaltados de Roles (Top, Jg, Mid, Adc, Supp)',
        descripcion: 'Estuche de lujo con 5 pines de metal esmaltado representando los roles de la Grieta.',
        precio: 22.00,
        existencia: 40,
        categoria: 'Accesorios',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-FIG-005',
        nombre: 'Figura Chibi Yasuo Maestría 7 con Muro de Viento',
        descripcion: 'Figura estilo chibi de Yasuo listo para tirar su ulti con efecto de tornado transparente.',
        precio: 35.00,
        existencia: 30,
        categoria: 'Figuras',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-PLU-003',
        nombre: 'Peluche Poro con Galleta Poro-Snax',
        descripcion: 'Poro edición especial abrazando una galleta crujiente Poro-Snax.',
        precio: 30.00,
        existencia: 60,
        categoria: 'Peluches',
        estado: 'DISPONIBLE'
    },
    {
        codigo: 'RIOT-CLO-004',
        nombre: 'Camiseta Pentakill III: Lost Chapter',
        descripcion: 'Camiseta negra 100% algodón con arte de portada del álbum de la banda de metal Pentakill.',
        precio: 38.00,
        existencia: 45,
        categoria: 'Ropa',
        estado: 'DISPONIBLE'
    }
];

const escape = (str) => String(str).replace(/'/g, "\\'");

const filas = productosLoL.map(p =>
    `('${escape(p.codigo)}', '${escape(p.nombre)}', '${escape(p.descripcion)}', ${p.precio}, ${p.existencia}, '${escape(p.categoria)}', '${p.estado}')`
);

const sql = `-- 🎮 Seed de Productos Oficiales de League of Legends & Worlds Merch
-- Base de datos: ecommerce_productos
-- Generado automáticamente para la demostración

USE ecommerce_productos;

INSERT INTO productos (codigo, nombre, descripcion, precio, existencia, categoria, estado)
VALUES
${filas.join(',\n')}
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio = VALUES(precio),
    existencia = VALUES(existencia),
    categoria = VALUES(categoria),
    estado = VALUES(estado);

SELECT COUNT(*) AS total_productos FROM productos;
`;

writeFileSync('productos-seed.sql', sql, 'utf8');
console.log(`✅ Archivo productos-seed.sql generado con ${productosLoL.length} productos de LoL Merch`);
console.log('📌 Para importarlo a MySQL ejecuta:');
console.log('   mysql -u root -p ecommerce_productos < productos-seed.sql');
