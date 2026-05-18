import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TaskService } from '../task/task.service';
export declare class UsuariosService {
    private prisma;
    private taskService;
    constructor(prisma: PrismaService, taskService: TaskService);
    create(dto: CreateUsuarioDto): Promise<{
        id_rol_usuario: string;
        t_doc: import("@prisma/client").$Enums.tipo_documento_t_doc;
        id_usuario: string;
        codigo: string | null;
        nom_1: string;
        nom_2: string | null;
        ape_1: string;
        ape_2: string | null;
        correo: string;
        telefono: bigint;
        contrasena: string;
        img_perfil: string | null;
        codigo_visible: string | null;
        reset_codigo: string | null;
        reset_expira: Date | null;
        estado: number;
    }>;
    findAll(query: any): Promise<{
        id_rol_usuario: string;
        t_doc: import("@prisma/client").$Enums.tipo_documento_t_doc;
        id_usuario: string;
        nom_1: string;
        nom_2: string | null;
        ape_1: string;
        ape_2: string | null;
        correo: string;
        telefono: bigint;
        img_perfil: string | null;
        codigo_visible: string | null;
        estado: number;
    }[]>;
    findOne(id_usuario: string): Promise<{
        id_rol_usuario: string;
        t_doc: import("@prisma/client").$Enums.tipo_documento_t_doc;
        id_usuario: string;
        nom_1: string;
        nom_2: string | null;
        ape_1: string;
        ape_2: string | null;
        correo: string;
        telefono: bigint;
        img_perfil: string | null;
        codigo_visible: string | null;
    }>;
    update(id_usuario: string, dto: UpdateUsuarioDto): Promise<{
        id_rol_usuario: string;
        t_doc: import("@prisma/client").$Enums.tipo_documento_t_doc;
        id_usuario: string;
        codigo: string | null;
        nom_1: string;
        nom_2: string | null;
        ape_1: string;
        ape_2: string | null;
        correo: string;
        telefono: bigint;
        contrasena: string;
        img_perfil: string | null;
        codigo_visible: string | null;
        reset_codigo: string | null;
        reset_expira: Date | null;
        estado: number;
    }>;
    remove(id_usuario: string): Promise<{
        message: string;
    }>;
    cambiarContrasena(id_usuario: string, contrasenaActual: string, nuevaContrasena: string): Promise<{
        message: string;
        success: boolean;
    }>;
    actualizarImagen(id_usuario: string, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
        img_perfil: string;
    }>;
    solicitarReset(correo: string): Promise<{
        message: string;
    }>;
    resetContrasena(correo: string, codigo: string, nuevaContrasena: string): Promise<{
        message: string;
        success: boolean;
    }>;
    toggleEstado(id: string): Promise<{
        id_rol_usuario: string;
        t_doc: import("@prisma/client").$Enums.tipo_documento_t_doc;
        id_usuario: string;
        codigo: string | null;
        nom_1: string;
        nom_2: string | null;
        ape_1: string;
        ape_2: string | null;
        correo: string;
        telefono: bigint;
        contrasena: string;
        img_perfil: string | null;
        codigo_visible: string | null;
        reset_codigo: string | null;
        reset_expira: Date | null;
        estado: number;
    }>;
}
