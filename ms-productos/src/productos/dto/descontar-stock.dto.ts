import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DescontarStockDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    cantidad: number;
}
