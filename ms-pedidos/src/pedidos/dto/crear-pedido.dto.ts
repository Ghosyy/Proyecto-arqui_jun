import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
    @IsString()
    productoCodigo: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    cantidad: number;
}

export class CrearPedidoDto {
    @IsOptional()
    @IsString()
    codigo?: string;

    @IsOptional()
    @IsString()
    usuario?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemPedidoDto)
    items: ItemPedidoDto[];
}
