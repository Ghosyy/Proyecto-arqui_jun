import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

export class ActualizarProductoDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    precio?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    existencia?: number;

    @IsOptional()
    @IsString()
    categoria?: string;

    @IsOptional()
    @IsIn(['DISPONIBLE', 'AGOTADO', 'DESCONTINUADO'])
    estado?: string;
}
