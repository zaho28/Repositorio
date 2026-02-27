import { IsNotEmpty, IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

//DTO para la creación de una nueva categoría en el inventario

export class CreateCategoriaDto {

 /* @ApiProperty({
    description: 'Nombre único de la categoría',
    example: 'Amigurrumis',
    type: String,
    minLength: 3,
    maxLength: 60,
  })
  @IsString({ message: 'El nombre de la categoría debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(60, { message: 'El nombre no puede exceder los 60 caracteres' })
  name: string;
}*/

    @IsString({ message: 'El nombre de la categoría debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
    nombre_c: string;

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @MaxLength(60, { message: 'La descripción no puede exceder los 60 caracteres' })
    @IsOptional()
    descripcion?: string;
}
