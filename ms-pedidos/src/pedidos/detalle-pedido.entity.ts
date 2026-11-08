// entidad de detalle de pedido
// cada fila es un producto comprado en una orden
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';
import type { Pedido } from './pedido.entity.js';

// tabla detalle_pedidos en el esquema pedidos
@Entity({ name: 'detalle_pedidos', schema: 'pedidos' })
export class DetallePedido {
    @PrimaryGeneratedColumn()
    id: number;

    // codigo del producto en ms-productos
    @Column()
    productoCodigo: string;

    // nombre guardado historicamente
    @Column()
    productoNombre: string;

    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioUnitario: number;

    // subtotal calculado cantidad por precio
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    // relacion con la cabecera del pedido con borrado en cascada
    @ManyToOne('Pedido', 'detalles', {
        onDelete: 'CASCADE',
    })
    pedido: Pedido;
}
