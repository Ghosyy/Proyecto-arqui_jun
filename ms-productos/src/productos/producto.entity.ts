// entidad de productos para typeorm
// use la misma logica de la entidad del proyecto de helados adaptada a riot merch
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

// tabla en el esquema productos de supabase
@Entity({ name: 'productos', schema: 'productos' })
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    // codigo unico de producto
    @Column({ unique: true })
    codigo: string;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    // precio con dos decimales
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    // inventario disponible
    @Column({ type: 'int' })
    existencia: number;

    @Column()
    categoria: string;

    // disponible, agotado o descontinuado
    @Column({ default: 'DISPONIBLE' })
    estado: string;
}
