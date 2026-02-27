import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {

    @IsString()
    @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
    @MaxLength(60)
    nom_producto: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    precio_unitario: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    stock_actual: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    stock_minimo: number;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    color?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    talla?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    tamaño?: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    @MaxLength(255)
    descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    id_categoria: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    id_clasificacion?: number;

    @IsString()
    @IsOptional()
    ruta_imagen?: string;

    @IsBoolean()
    @IsOptional()
    estado?: boolean;
}