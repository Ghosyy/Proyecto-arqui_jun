// controlador de productos
// agarre la misma logica del controlador de helados y la adapte
import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { CrearProductoDto } from './dto/crear-producto.dto.js';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto.js';
import { DescontarStockDto } from './dto/descontar-stock.dto.js';

@Controller('productos')
export class ProductosController {
    constructor(private readonly productosService: ProductosService) {}

    // crear producto nuevo
    @Post()
    crear(@Body() dto: CrearProductoDto) {
        return this.productosService.crear(dto)
    }

    // listar catalogo completo
    @Get()
    listar() {
        return this.productosService.listar()
    }

    // filtrar por categoria
    @Get('categoria/:categoria')
    listarPorCategoria(@Param('categoria') categoria: string) {
        return this.productosService.listarPorCategoria(categoria)
    }

    // buscar un producto por su codigo
    @Get(':codigo')
    buscarPorCodigo(@Param('codigo') codigo: string) {
        return this.productosService.buscarPorCodigo(codigo)
    }

    // actualizar datos de un producto
    @Patch(':codigo')
    actualizar(@Param('codigo') codigo: string, @Body() dto: ActualizarProductoDto) {
        return this.productosService.actualizar(codigo, dto)
    }

    // descontar existencia cuando se hace un pedido
    @Patch(':codigo/descontar')
    descontarStock(@Param('codigo') codigo: string, @Body() dto: DescontarStockDto) {
        return this.productosService.descontarStock(codigo, dto)
    }

    // eliminar producto
    @Delete(':codigo')
    eliminar(@Param('codigo') codigo: string) {
        return this.productosService.eliminar(codigo)
    }
}