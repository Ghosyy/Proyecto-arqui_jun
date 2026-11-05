import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pedido } from './pedido.entity.js';
import { DetallePedido } from './detalle-pedido.entity.js';
import { PedidosController } from './pedidos.controller.js';
import { PedidosService } from './pedidos.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Pedido, DetallePedido])],
    controllers: [PedidosController],
    providers: [PedidosService],
    exports: [PedidosService],
})
export class PedidosModule {}
