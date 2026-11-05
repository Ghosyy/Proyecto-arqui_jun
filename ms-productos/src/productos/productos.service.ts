import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Producto } from './producto.entity.js';
import { CrearProductoDto } from './dto/crear-producto.dto.js';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto.js';
import { DescontarStockDto } from './dto/descontar-stock.dto.js';

@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(Producto)
        private readonly productosRepositorio: Repository<Producto>,
    ) {}

    async crear(dto: CrearProductoDto): Promise<Producto> {
        const existente = await this.productosRepositorio.findOneBy({
            codigo: dto.codigo
        })

        if (existente) {
            throw new ConflictException(
                'Ya existe este producto'
            )
        }

        const producto = this.productosRepositorio.create(dto)
        return this.productosRepositorio.save(producto)
    }

    listar(): Promise<Producto[]> {
        return this.productosRepositorio.find()
    }

    listarPorCategoria(categoria: string): Promise<Producto[]> {
        return this.productosRepositorio.findBy({ categoria })
    }

    async buscarPorCodigo(codigo: string): Promise<Producto> {
        const producto = await this.productosRepositorio.findOneBy({
            codigo
        })

        if (!producto) {
            throw new NotFoundException('No existe este producto')
        }

        return producto
    }

    async actualizar(codigo: string, dto: ActualizarProductoDto): Promise<Producto> {
        const producto = await this.buscarPorCodigo(codigo)

        Object.assign(producto, dto)

        if (producto.existencia === 0) {
            producto.estado = 'AGOTADO'
        } else if (producto.existencia > 0 && producto.estado === 'AGOTADO') {
            producto.estado = 'DISPONIBLE'
        }

        return this.productosRepositorio.save(producto)
    }

    async descontarStock(codigo: string, dto: DescontarStockDto): Promise<Producto> {
        const producto = await this.buscarPorCodigo(codigo)

        if (producto.existencia < dto.cantidad) {
            throw new BadRequestException('No hay suficiente stock para este producto')
        }

        producto.existencia -= dto.cantidad

        if (producto.existencia === 0) {
            producto.estado = 'AGOTADO'
        }

        return this.productosRepositorio.save(producto)
    }

    async eliminar(codigo: string): Promise<Producto> {
        const producto = await this.buscarPorCodigo(codigo)

        producto.estado = 'DESCONTINUADO'
        return this.productosRepositorio.save(producto)
    }
}
