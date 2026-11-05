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

    @Post()
    crear(
        @Body() dto: CrearPedidoDto,
        @Headers('x-usuario') usuario?: string,
    ) {
        return this.pedidosService.crear(dto, usuario)
    }

    @Get()
    listar() {
        return this.pedidosService.listar()
    }

    @Get(':codigo')
    buscarPorCodigo(@Param('codigo') codigo: string) {
        return this.pedidosService.buscarPorCodigo(codigo)
    }

    @Patch(':codigo/estado')
    actualizarEstado(
        @Param('codigo') codigo: string,
        @Body() dto: ActualizarEstadoPedidoDto,
    ) {
        return this.pedidosService.actualizarEstado(codigo, dto)
    }

    @Delete(':codigo')
    eliminar(@Param('codigo') codigo: string) {
        return this.pedidosService.eliminar(codigo)
    }
}
