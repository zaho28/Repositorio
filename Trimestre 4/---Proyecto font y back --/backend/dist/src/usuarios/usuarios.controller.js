"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("./usuarios.service");
const create_usuario_dto_1 = require("./dto/create-usuario.dto");
const update_usuario_dto_1 = require("./dto/update-usuario.dto");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let UsuariosController = class UsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    async create(createUsuarioDto) {
        console.log('controller - crear usuario:', JSON.stringify(createUsuarioDto));
        try {
            return await this.usuariosService.create(createUsuarioDto);
        }
        catch (error) {
            if (error.code === '23505' || error.code === 11000) {
                throw new common_1.ConflictException('El correo ya está registrado');
            }
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error('Error al crear usuario:', error);
            throw new common_1.InternalServerErrorException('Error interno al crear el usuario');
        }
    }
    async findAll(query) {
        console.log('controller - todos los usuarios:', JSON.stringify(query));
        try {
            return await this.usuariosService.findAll(query);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener los usuarios');
        }
    }
    async findOne(id) {
        console.log('controller - detalle de usuario:', JSON.stringify({ id }));
        if (!id || id.trim() === '') {
            throw new common_1.BadRequestException('El ID del usuario es inválido');
        }
        const usuario = await this.usuariosService.findOne(id);
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
        }
        return usuario;
    }
    async update(id, updateUsuarioDto) {
        console.log('controller - actualizar usuario:', { id, updateUsuarioDto });
        try {
            const usuario = await this.usuariosService.update(id, updateUsuarioDto);
            if (!usuario) {
                throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            return usuario;
        }
        catch (error) {
            if (error.code === '23505' || error.code === 11000) {
                throw new common_1.ConflictException('El correo ya está en uso por otro usuario');
            }
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al actualizar el usuario');
        }
    }
    async cambiarContrasena(id, body) {
        console.log('controller - cambiar contraseña:', id);
        if (!body.contrasenaActual || !body.nuevaContrasena) {
            throw new common_1.BadRequestException('La contraseña actual y la nueva contraseña son requeridas');
        }
        if (body.nuevaContrasena.length < 8) {
            throw new common_1.BadRequestException('La nueva contraseña debe tener mínimo 8 caracteres');
        }
        try {
            return await this.usuariosService.cambiarContrasena(id, body.contrasenaActual, body.nuevaContrasena);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al cambiar la contraseña');
        }
    }
    async remove(id) {
        console.log('controller - eliminar usuario:', JSON.stringify({ id }));
        try {
            const resultado = await this.usuariosService.remove(id);
            if (!resultado) {
                throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            return resultado;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al eliminar el usuario');
        }
    }
    async subirImagen(id, file) {
        console.log('controller - subir imagen:', { id, file: file?.filename });
        if (!file) {
            throw new common_1.BadRequestException('No se envió ningún archivo o el tipo no es permitido. Solo se aceptan jpg, jpeg, png y webp');
        }
        try {
            const usuario = await this.usuariosService.findOne(id);
            if (!usuario) {
                throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            return await this.usuariosService.actualizarImagen(id, file);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al guardar la imagen en disco');
        }
    }
    async solicitarReset(body) {
        if (!body.correo || !body.correo.includes('@')) {
            throw new common_1.BadRequestException('El correo electrónico es inválido o está ausente');
        }
        try {
            await this.usuariosService.solicitarReset(body.correo);
            return { message: 'Si el correo está registrado, recibirás un código de recuperación' };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al procesar la solicitud de reset');
        }
    }
    async resetContrasena(body) {
        if (!body.correo || !body.codigo || !body.nuevaContrasena) {
            throw new common_1.BadRequestException('El correo, el código y la nueva contraseña son requeridos');
        }
        if (body.nuevaContrasena.length < 8) {
            throw new common_1.BadRequestException('La nueva contraseña debe tener mínimo 8 caracteres');
        }
        try {
            return await this.usuariosService.resetContrasena(body.correo, body.codigo, body.nuevaContrasena);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al restablecer la contraseña');
        }
    }
    async toggleEstado(id) {
        try {
            const usuario = await this.usuariosService.toggleEstado(id);
            if (!usuario) {
                throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            return usuario;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al cambiar el estado del usuario');
        }
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Crear usuario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario creado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos en el correo, campos requeridos vacíos).' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El correo ya está registrado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al guardar en la base de datos.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar usuarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios retornada.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros de query inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT ausente o expirado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos para listar usuarios.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener usuario por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID con formato inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT ausente o expirado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario actualizado correctamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos en la actualización.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT ausente o expirado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El correo ya está en uso por otro usuario.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_usuario_dto_1.UpdateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id/cambiar-contrasena'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar contraseña del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contraseña actualizada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Nueva contraseña no cumple los requisitos mínimos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Contraseña actual incorrecta.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "cambiarContrasena", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario eliminado correctamente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT ausente o expirado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos para eliminar usuarios.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "remove", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(':id/imagen'),
    (0, swagger_1.ApiOperation)({ summary: 'Subir imagen de perfil' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imagen subida y guardada correctamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Archivo no enviado o tipo no permitido (solo jpg, jpeg, png, webp).' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 413, description: 'La imagen supera el límite de 5 MB.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al guardar el archivo en disco.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/perfiles',
            filename: (req, file, cb) => {
                const nombreUnico = `${req.params.id}-${Date.now()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, nombreUnico);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                cb(new common_1.BadRequestException('Solo se permiten imágenes en formato jpg, jpeg, png o webp'), false);
            }
            else {
                cb(null, true);
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "subirImagen", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('solicitar-reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitar código de reset de contraseña' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Si el correo existe, se enviará un código de recuperación.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Correo incorrecto o ausente.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al enviar el correo.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "solicitarReset", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-contrasena'),
    (0, swagger_1.ApiOperation)({ summary: 'Restablecer contraseña con código' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contraseña restablecida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Código inválido, expirado o nueva contraseña débil.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado con ese correo.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "resetContrasena", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    (0, swagger_1.ApiOperation)({ summary: 'Activar o desactivar usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado del usuario cambiado (activo/inactivo).' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token JWT ausente o expirado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sin permisos para cambiar el estado del usuario.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "toggleEstado", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map