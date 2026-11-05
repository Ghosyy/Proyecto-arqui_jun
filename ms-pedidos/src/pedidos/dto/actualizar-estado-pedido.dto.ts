import { IsIn } from 'class-validator';

export class ActualizarEstadoPedidoDto {
    @IsIn(['COMPLETADO', 'PENDIENTE', 'CANCELADO'])
    estado: string;
}
