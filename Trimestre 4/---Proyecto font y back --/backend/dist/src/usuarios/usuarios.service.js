"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const task_service_1 = require("../task/task.service");
const SALT_ROUNDS = 10;
let UsuariosService = class UsuariosService {
    prisma;
    taskService;
    constructor(prisma, taskService) {
        this.prisma = prisma;
        this.taskService = taskService;
    }
    async create(dto) {
        console.log('service - crear usuario:', JSON.stringify(dto));
        const hashedPassword = await bcrypt.hash(dto.contrasena, SALT_ROUNDS);
        let hashedCodigo = null;
        let codigoVisible = null;
        if (dto.codigo) {
            hashedCodigo = await bcrypt.hash(dto.codigo.toString(), SALT_ROUNDS);
            codigoVisible = dto.codigo.toString();
        }
        const rol = dto.id_rol_usuario || '1';
        return this.prisma.usuario.create({
            data: {
                id_usuario: dto.id_usuario,
                nom_1: dto.nom_1,
                nom_2: dto.nom_2 ?? null,
                ape_1: dto.ape_1,
                ape_2: dto.ape_2 ?? null,
                correo: dto.correo,
                telefono: BigInt(dto.telefono),
                contrasena: hashedPassword,
                codigo: hashedCodigo,
                codigo_visible: codigoVisible,
                id_rol_usuario: rol,
                t_doc: dto.t_doc,
                img_perfil: dto.img_perfil ?? null,
            },
        });
    }
    async findAll(query) {
        console.log('service - todos los usuarios:', JSON.stringify(query));
        const usuarios = await this.prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nom_1: true,
                nom_2: true,
                ape_1: true,
                ape_2: true,
                correo: true,
                telefono: true,
                id_rol_usuario: true,
                t_doc: true,
                img_perfil: true,
                codigo_visible: true,
                estado: true,
            },
        });
        return usuarios;
    }
    async findOne(id_usuario) {
        console.log('service - detalle de usuario:', JSON.stringify({ id_usuario }));
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario },
            select: {
                id_usuario: true,
                nom_1: true,
                nom_2: true,
                ape_1: true,
                ape_2: true,
                correo: true,
                telefono: true,
                id_rol_usuario: true,
                t_doc: true,
                img_perfil: true,
                codigo_visible: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException(`Usuario ${id_usuario} no encontrado`);
        return user;
    }
    async update(id_usuario, dto) {
        console.log('service - actualizar usuario:', { id_usuario, dto });
        await this.findOne(id_usuario);
        const data = { ...dto };
        if (dto.contrasena) {
            data.contrasena = await bcrypt.hash(dto.contrasena, SALT_ROUNDS);
        }
        if (dto.codigo) {
            data.codigo = await bcrypt.hash(dto.codigo.toString(), SALT_ROUNDS);
            data.codigo_visible = dto.codigo.toString();
        }
        return this.prisma.usuario.update({
            where: { id_usuario },
            data,
        });
    }
    async remove(id_usuario) {
        console.log('service - eliminar usuario:', JSON.stringify({ id_usuario }));
        await this.findOne(id_usuario);
        try {
            await this.prisma.usuario.delete({
                where: { id_usuario },
            });
            return { message: `Usuario ${id_usuario} eliminado exitosamente` };
        }
        catch (error) {
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('No se puede eliminar este usuario porque tiene registros relacionados.');
            }
            throw error;
        }
    }
    async cambiarContrasena(id_usuario, contrasenaActual, nuevaContrasena) {
        console.log('service - cambiar contraseña:', JSON.stringify({ id_usuario, contrasenaActual, nuevaContrasena }));
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario },
        });
        if (!user || !user.contrasena)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const passwordMatch = await bcrypt.compare(contrasenaActual, user.contrasena);
        if (!passwordMatch)
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        const hashedPassword = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS);
        await this.prisma.usuario.update({
            where: { id_usuario },
            data: { contrasena: hashedPassword },
        });
        return { message: 'Contraseña actualizada exitosamente', success: true };
    }
    async actualizarImagen(id_usuario, file) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo');
        await this.findOne(id_usuario);
        const ruta_imagen = `/uploads/perfiles/${file.filename}`;
        await this.prisma.usuario.update({
            where: { id_usuario },
            data: { img_perfil: ruta_imagen },
        });
        return {
            statusCode: 200,
            message: 'Imagen actualizada exitosamente',
            img_perfil: ruta_imagen,
        };
    }
    async solicitarReset(correo) {
        const user = await this.prisma.usuario.findFirst({
            where: { correo },
        });
        if (!user)
            throw new common_1.NotFoundException('No existe un usuario con ese correo');
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.usuario.update({
            where: { id_usuario: user.id_usuario },
            data: { codigo_visible: codigo },
        });
        await this.taskService.enviarCodigoReset(correo, codigo);
        return { message: 'Código enviado a tu correo' };
    }
    async resetContrasena(correo, codigo, nuevaContrasena) {
        const user = await this.prisma.usuario.findFirst({
            where: { correo },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (!user.codigo_visible)
            throw new common_1.BadRequestException('No hay solicitud de reset activa');
        if (user.codigo_visible !== codigo)
            throw new common_1.BadRequestException('Código incorrecto');
        const hashedPassword = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS);
        await this.prisma.usuario.update({
            where: { id_usuario: user.id_usuario },
            data: {
                contrasena: hashedPassword,
                codigo_visible: null,
            },
        });
        return { message: 'Contraseña actualizada exitosamente', success: true };
    }
    async toggleEstado(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id_usuario: id },
            select: { estado: true }
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const nuevoEstado = usuario.estado === 1 ? 0 : 1;
        return this.prisma.usuario.update({
            where: { id_usuario: id },
            data: { estado: nuevoEstado },
        });
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, task_service_1.TaskService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map