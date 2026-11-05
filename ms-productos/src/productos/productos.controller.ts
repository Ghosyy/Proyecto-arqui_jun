import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { CrearProductoDto } from './dto/crear-producto.dto.js';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto.js';
import { DescontarStockDto } from './dto/descontar-stock.dto.js';

@Controller('productos')
export class ProductosController {
    constructor(private readonly productosService: ProductosService) {}

    @Post()
    crear(@Body() dto: CrearProductoDto) {
        return this.productosService.crear(dto)
    }

    @Get()
    listar() {
        return this.productosService.listar()
    }

    @Get('categoria/:categoria')
    listarPorCategoria(@Param('categoria') categoria: string) {
        return this.productosService.listarPorCategoria(categoria)
    }

    @Get(':codigo')
    buscarPorCodigo(@Param('codigo') codigo: string) {
        return this.productosService.buscarPorCodigo(codigo)
    }

    @Patch(':codigo')
    actualizar(@Param('codigo') codigo: string, @Body() dto: ActualizarProductoDto) {
        return this.productosService.actualizar(codigo, dto)
    }

    @Patch(':codigo/descontar')
    descontarStock(@Param('codigo') codigo: string, @Body() dto: DescontarStockDto) {
        return this.productosService.descontarStock(codigo, dto)
    }

    @Delete(':codigo')
    eliminar(@Param('codigo') codigo: string) {
        return this.productosService.eliminar(codigo)
    }
}