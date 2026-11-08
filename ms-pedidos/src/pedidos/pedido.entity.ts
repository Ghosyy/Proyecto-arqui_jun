// entidad de pedidos para typeorm (cabecera de la venta)
// use la misma logica de maestro detalle que en el proyecto de helados
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { DetallePedido } from './detalle-pedido.entity.js';

// tabla en el esquema pedidos de supabase
@Entity({ name: 'pedidos', schema: 'pedidos' })
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    // codigo unico del pedido
    @Column({ unique: true })
    codigo: string;

    // usuario que hizo la compra que inyecto el broker
    @Column()
    usuario: string;

    // total acumulado de la compra
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    // fecha automatica de creacion
    @CreateDateColumn()
    fecha: Date;

    // completado, pendiente o cancelado
    @Column({ default: 'COMPLETADO' })
    estado: string;

    // relacion uno a muchos con el detalle del pedido
    @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, {
        cascade: true,
        eager: true,
    })
    detalles: DetallePedido[];
}
