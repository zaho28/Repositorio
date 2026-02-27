import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, IsBoolean, MaxLength, Min, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovimientoDto {

    @IsNumber()
    @IsNotEmpty({ message: 'La cantidad debe ser obligatoria ' })
    @Min(1)
    @Type(() => Number)
    cantidad_m: number;

    @IsDate()
    @IsNotEmpty({ message: 'La fecha es obligatoria' })
    @MaxDate(new Date(), { message: 'No puede ser una fecha futura' })
    @Type(() => Date)
    fecha_m: Date;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    observaciones?: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    id_categoria: number;

    @IsString()
    @IsNotEmpty({ message: 'El tipo de movimiento es obligatorio' })
    id_m: string; // 'M-E' o 'M-S'

    @IsString()
    @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
    @Type(() => Number)
    id_producto: Number; 

    @IsString()
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    @Type(() => Number)
    id_usuario: Number
}
