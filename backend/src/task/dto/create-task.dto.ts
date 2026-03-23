// task/dto/create-task.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
//validar
export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio' })
    titulo: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion: string;

    @IsIn(['pendiente', 'en_proceso', 'completado'])
    estado: 'pendiente' | 'en_proceso' | 'completado'; 

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    id_usuario: number;
}