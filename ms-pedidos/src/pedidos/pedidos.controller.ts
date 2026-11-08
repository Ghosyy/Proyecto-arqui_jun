// controlador de pedidos
// recibe peticiones del broker con la cabecera x-usuario
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Headers,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service.js';
import { CrearPedidoDto } from './dto/crear-pedido.dto.js';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto.js';

@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) {}

    // crear pedido recibiendo el usuario autenticado que manda el broker
    @Post()
    crear(
        @Body() dto: CrearPedidoDto,
        @Headers('x-usuario') usuario?: string,
    ) {
        return this.pedidosService.crear(dto, usuario)
    }

    // listar todas las ordenes
    @Get()
    listar() {
        return this.pedidosService.listar()
    }

    // buscar orden por codigo
    @Get(':codigo')
    buscarPorCodigo(@Param('codigo') codigo: string) {
        return this.pedidosService.buscarPorCodigo(codigo)
    }

    // actualizar estado o cancelar orden
    @Patch(':codigo/estado')
    actualizarEstado(
        @Param('codigo') codigo: string,
        @Body() dto: ActualizarEstadoPedidoDto,
    ) {
        return this.pedidosService.actualizarEstado(codigo, dto)
    }

    // eliminar o cancelar pedido
    @Delete(':codigo')
    eliminar(@Param('codigo') codigo: string) {
        return this.pedidosService.eliminar(codigo)
    }
}
