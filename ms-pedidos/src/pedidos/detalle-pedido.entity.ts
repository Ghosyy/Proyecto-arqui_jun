import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';
import type { Pedido } from './pedido.entity.js';

@Entity({ name: 'detalle_pedidos', schema: 'pedidos' })
export class DetallePedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productoCodigo: string;

    @Column()
    productoNombre: string;

    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioUnitario: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @ManyToOne('Pedido', 'detalles', {
        onDelete: 'CASCADE',
    })
    pedido: Pedido;
}
