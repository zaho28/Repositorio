import { IsNotEmpty, IsString, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: 'El ID es obligatorio' })
    @MaxLength(15)
    id_usuario: string;

    @IsString()
    @IsNotEmpty({ message: 'El primer nombre es obligatorio' })
    @MaxLength(50)
    nom_1: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    nom_2?: string;

    @IsString()
    @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
    @MaxLength(50)
    ape_1: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    ape_2?: string;

    @IsEmail({}, { message: 'El correo no es válido' })
    @IsNotEmpty()
    @MaxLength(40)
    correo: string;

    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    telefono: number;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6)
    contrasena: string;

    @IsString()
    @IsOptional()
    codigo?: string;

    @IsString()
    @IsNotEmpty({ message: 'El rol es obligatorio' })
    id_rol_usuario: string;

    @IsString()
    @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
    t_doc: string;

    @IsString()
    @IsOptional()
    img_perfil?: string;
}
