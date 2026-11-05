import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearProductoDto {
    @IsString()
    codigo: string;

    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    precio: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    existencia: number;

    @IsString()
    categoria: string;

    @IsOptional()
    @IsIn(['DISPONIBLE', 'AGOTADO', 'DESCONTINUADO'])
    estado?: string;
}
