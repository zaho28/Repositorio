import { IsNotEmpty, IsString, IsNumber, IsDate, MaxLength, Min, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovimientoDto {

    @IsNumber()
    @IsNotEmpty({ message: 'La cantidad es obligatoria ' })
    @Min(1, { message: 'La cantidad debe ser un número positivo' })
    @Type(() => Number) 
    Cantidad_m: number;

    @IsDate()
    @IsNotEmpty({ message: 'La fecha es obligatoria' })
    @MaxDate(new Date(), { message: 'No puede ser una fecha futura' })
    @Type(() => Date)
    fecha_m: Date;

    @IsString()
    @IsNotEmpty({ message: 'Las observaciones son obligatorias' })
    @MaxLength(255)
    observaciones?: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El ID de la categoría es obligatorio' })
    @Type(() => Number)
    id_categoria: number;

    @IsString()
    @IsNotEmpty({ message: 'El tipo de movimiento es obligatorio' })
    id_m: string; // 'M-E' o 'M-S'

    @IsNumber()
    @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
    id_producto: Number; 

    @IsString()
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    id_usuario: String;
}
