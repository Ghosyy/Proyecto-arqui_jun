// logica de negocio para pedidos y compras
// use la misma logica de compras del proyecto de helados adaptada a microservicios
import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
    GatewayTimeoutException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { Pedido } from './pedido.entity.js';
import { DetallePedido } from './detalle-pedido.entity.js';
import { CrearPedidoDto } from './dto/crear-pedido.dto.js';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto.js';

@Injectable()
export class PedidosService {
    private readonly urlMsProductos: string;

    constructor(
        @InjectRepository(Pedido)
        private readonly pedidosRepositorio: Repository<Pedido>,

        @InjectRepository(DetallePedido)
        private readonly detalleRepositorio: Repository<DetallePedido>,

        private readonly configService: ConfigService,
    ) {
        // formatear url hacia ms-productos
        let url = this.configService.get<string>(
            'URL_MS_PRODUCTOS',
            'http://localhost:3001/productos',
        ).trim().replace(/\/+$/, '');

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }
        if (!url.endsWith('/productos')) {
            url = `${url}/productos`;
        }
        this.urlMsProductos = url;
    }

    async crear(dto: CrearPedidoDto, usuarioHeader?: string): Promise<Pedido> {
        // validar que mande al menos un producto
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException('El pedido debe tener al menos un producto')
        }

        // verificar que no se repita el codigo de pedido
        const codigoPedido = dto.codigo || `PED-${Date.now().toString().slice(-6)}`
        const existente = await this.pedidosRepositorio.findOneBy({ codigo: codigoPedido })
        if (existente) {
            throw new ConflictException('Ya existe este pedido')
        }

        // usuario autenticado que mando el broker
        const usuarioFinal = usuarioHeader || dto.usuario || 'usuario'

        const productosVerificados: {
            codigo: string;
            nombre: string;
            precio: number;
            cantidad: number;
            subtotal: number;
        }[] = []

        let totalCalculado = 0

        // comunicacion http con ms-productos para chequear existencia y precios
        for (const item of dto.items) {
            let productoRemoto: any
            try {
                const respuesta = await fetch(`${this.urlMsProductos}/${item.productoCodigo}`, {
                    signal: AbortSignal.timeout(5000),
                })

                if (respuesta.status === 404) {
                    throw new NotFoundException(`No existe el producto ${item.productoCodigo}`)
                }

                if (!respuesta.ok) {
                    throw new BadRequestException(`Error al consultar el producto ${item.productoCodigo}`)
                }

                productoRemoto = await respuesta.json()
            } catch (error: any) {
                if (error instanceof NotFoundException || error instanceof BadRequestException) {
                    throw error
                }
                if (error.name === 'TimeoutError') {
                    throw new GatewayTimeoutException('ms-productos tardo demasiado en responder')
                }
                throw new BadGatewayException('ms-productos no esta disponible')
            }

            // regla de negocio que verifica si alcanza el inventario
            if (productoRemoto.existencia < item.cantidad) {
                throw new BadRequestException(
                    `Stock insuficiente para ${productoRemoto.nombre}`
                )
            }

            const precioUnitario = Number(productoRemoto.precio)
            const subtotal = precioUnitario * item.cantidad
            totalCalculado += subtotal

            productosVerificados.push({
                codigo: productoRemoto.codigo,
                nombre: productoRemoto.nombre,
                precio: precioUnitario,
                cantidad: item.cantidad,
                subtotal,
            })
        }

        // llamada a ms-productos para descontar el inventario
        for (const verificado of productosVerificados) {
            try {
                await fetch(`${this.urlMsProductos}/${verificado.codigo}/descontar`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cantidad: verificado.cantidad }),
                    signal: AbortSignal.timeout(5000),
                })
            } catch (error) {
                console.error(`Error descontando stock para ${verificado.codigo}`, error)
            }
        }

        // guardar cabecera y detalles en supabase
        const nuevoPedido = this.pedidosRepositorio.create({
            codigo: codigoPedido,
            usuario: usuarioFinal,
            total: totalCalculado,
            estado: 'COMPLETADO',
        })

        const detalles = productosVerificados.map((p) =>
            this.detalleRepositorio.create({
                productoCodigo: p.codigo,
                productoNombre: p.nombre,
                cantidad: p.cantidad,
                precioUnitario: p.precio,
                subtotal: p.subtotal,
            }),
        )

        nuevoPedido.detalles = detalles
        return this.pedidosRepositorio.save(nuevoPedido)
    }

    listar(): Promise<Pedido[]> {
        // listar todas las compras
        return this.pedidosRepositorio.find()
    }

    async buscarPorCodigo(codigo: string): Promise<Pedido> {
        // buscar una orden por su codigo
        const pedido = await this.pedidosRepositorio.findOneBy({ codigo })
        if (!pedido) {
            throw new NotFoundException('No existe este pedido')
        }
        return pedido
    }

    async actualizarEstado(codigo: string, dto: ActualizarEstadoPedidoDto): Promise<Pedido> {
        // cambiar estado a cancelado o pendiente
        const pedido = await this.buscarPorCodigo(codigo)
        pedido.estado = dto.estado
        return this.pedidosRepositorio.save(pedido)
    }

    async eliminar(codigo: string): Promise<Pedido> {
        // borrado logico marcando el pedido como cancelado
        const pedido = await this.buscarPorCodigo(codigo)
        pedido.estado = 'CANCELADO'
        return this.pedidosRepositorio.save(pedido)
    }
}
