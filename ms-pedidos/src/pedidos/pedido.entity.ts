import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { DetallePedido } from './detalle-pedido.entity.js';

@Entity({ name: 'pedidos', schema: 'pedidos' })
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: string;

    @Column()
    usuario: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @CreateDateColumn()
    fecha: Date;

    @Column({ default: 'COMPLETADO' })
    estado: string;

    @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, {
        cascade: true,
        eager: true,
    })
    detalles: DetallePedido[];
}
