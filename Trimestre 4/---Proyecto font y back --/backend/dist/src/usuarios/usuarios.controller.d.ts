import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<{
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
    cambiarContrasena(id: string, body: {
        contrasenaActual: string;
        nuevaContrasena: string;
    }): Promise<{
        message: string;
        success: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    subirImagen(id: string, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
        img_perfil: string;
    }>;
    solicitarReset(body: {
        correo: string;
    }): Promise<{
        message: string;
    }>;
    resetContrasena(body: {
        correo: string;
        codigo: string;
        nuevaContrasena: string;
    }): Promise<{
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
