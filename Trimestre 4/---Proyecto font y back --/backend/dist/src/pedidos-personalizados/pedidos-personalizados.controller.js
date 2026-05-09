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
exports.PedidosPersonalizadosController = void 0;
const common_1 = require("@nestjs/common");
const pedidos_personalizados_service_1 = require("./pedidos-personalizados.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
let PedidosPersonalizadosController = class PedidosPersonalizadosController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getMateriales(query) {
        try {
            return await this.service.getMateriales(query);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al obtener materiales');
        }
    }
    async getMaterialesPorTipo(tipo) {
        try {
            return await this.service.getMaterialesPorTipo(tipo);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al obtener materiales por tipo');
        }
    }
    async getColores(id) {
        try {
            return await this.service.getColoresMaterial(+id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al obtener colores');
        }
    }
    async getDisenos(id) {
        try {
            return await this.service.getDisenosMaterial(+id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al obtener diseños');
        }
    }
    async crearMaterial(dto) {
        try {
            return await this.service.crearMaterial(dto);
        }
        catch (error) {
            if (error.code === '23505' || error.code === 11000) {
                throw new common_1.ConflictException('Ya existe un material con ese nombre');
            }
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al crear material');
        }
    }
    async actualizarMaterial(id, dto) {
        try {
            const materialActualizado = await this.service.actualizarMaterial(+id, dto);
            if (!materialActualizado) {
                throw new common_1.NotFoundException('Material no encontrado');
            }
            return materialActualizado;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error.code === '23505' || error.code === 11000) {
                throw new common_1.ConflictException('Ya existe un material con ese nombre');
            }
            throw new common_1.InternalServerErrorException('Error al actualizar material');
        }
    }
    async subirImagenMaterial(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('Es necesario subir un archivo de imagen');
        }
        try {
            const materialConImagen = await this.service.actualizarImagenMaterial(+id, file);
            if (!materialConImagen) {
                throw new common_1.NotFoundException('Material no encontrado');
            }
            return materialConImagen;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al subir imagen del material');
        }
    }
    async crearPedido(dto) {
        try {
            return await this.service.crearPedido(dto);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error.message?.includes('Stock') || error.status === 422) {
                throw new common_1.UnprocessableEntityException('No hay suficiente stock de los materiales seleccionados.');
            }
            throw new common_1.InternalServerErrorException('Error al crear pedido personalizado');
        }
    }
    async findAll(query) {
        try {
            return await this.service.findAll(query);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al obtener pedidos personalizados');
        }
    }
    async findByUsuario(id_usuario) {
        try {
            const pedidos = await this.service.findByUsuario(id_usuario);
            if (!pedidos) {
                throw new common_1.NotFoundException('Pedido del usuario no encontrado');
            }
            return pedidos;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al obtener pedidos personalizados del usuario');
        }
    }
};
exports.PedidosPersonalizadosController = PedidosPersonalizadosController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('materiales'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los materiales disponibles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de materiales obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al consultar materiales.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "getMateriales", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('materiales/:tipo'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener materiales por tipo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Materiales obtenidos exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al consultar materiales por tipo.' }),
    __param(0, (0, common_1.Param)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "getMaterialesPorTipo", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('materiales/:id/colores'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "getColores", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('materiales/:id/disenos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "getDisenos", null);
__decorate([
    (0, common_1.Post)('materiales'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo material' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Material creado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de material inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto: Ya existe un material con ese nombre.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al crear material.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "crearMaterial", null);
__decorate([
    (0, common_1.Patch)('materiales/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un material existente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Material actualizado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de material inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto: Ya existe un material con ese nombre.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al actualizar material.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "actualizarMaterial", null);
__decorate([
    (0, common_1.Post)('materiales/:id/imagen'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const carpeta = './uploads/materiales';
                (0, fs_1.mkdirSync)(carpeta, { recursive: true });
                cb(null, carpeta);
            },
            filename: (req, file, cb) => {
                const nombre = `material-${req.params.id}-${Date.now()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, nombre);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new Error('Solo imagines'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Subir imagen para un material' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imagen subida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Archivo inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al subir imagen.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "subirImagenMaterial", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo pedido personalizado' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pedido personalizado creado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de pedido inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Material no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'Stock insuficiente para uno o mas materiales seleccionados.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al crear pedido personalizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "crearPedido", null);
__decorate([
    (0, roles_decorator_1.Roles)('1', '3'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los pedidos personalizados (admin/trabajador)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pedidos personalizados obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Token no proporcionado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - Permisos insuficiente.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al consultar pedidos personalizados.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('usuario/:id_usuario'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener pedidos personalizados de un usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pedidos personalizados del usuario obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Token no proporcionado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - Permisos insuficiente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al consultar pedidos personalizados del usuario.' }),
    __param(0, (0, common_1.Param)('id_usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidosPersonalizadosController.prototype, "findByUsuario", null);
exports.PedidosPersonalizadosController = PedidosPersonalizadosController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('pedidos-personalizados'),
    __metadata("design:paramtypes", [pedidos_personalizados_service_1.PedidosPersonalizadosService])
], PedidosPersonalizadosController);
//# sourceMappingURL=pedidos-personalizados.controller.js.map