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
exports.PedidosController = void 0;
const common_1 = require("@nestjs/common");
const pedidos_service_1 = require("./pedidos.service");
const create_pedido_dto_1 = require("./dto/create-pedido.dto");
const update_pedido_dto_1 = require("./dto/update-pedido.dto");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_enum_1 = require("../auth/enums/roles.enum");
let PedidosController = class PedidosController {
    pedidosService;
    constructor(pedidosService) {
        this.pedidosService = pedidosService;
    }
    async create(dto) {
        console.log('controller - Crear pedido:', JSON.stringify(dto));
        try {
            return await this.pedidosService.create(dto);
        }
        catch (error) {
            console.error('ERROR COMPLETO:', JSON.stringify({
                message: error.message,
                code: error.code,
                meta: error.meta,
                stack: error.stack?.split('\n').slice(0, 5),
            }));
            if (error.code === '23505' || error.code === 11000) {
                throw new common_1.ConflictException('Este numero de pedido ya ha sido registrado.');
            }
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al procesar el pedido.');
        }
    }
    async findAll(query) {
        try {
            return await this.pedidosService.findAll(query);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener los pedidos.');
        }
    }
    async findByUsuario(id_usuario) {
        try {
            const pedidos = await this.pedidosService.findByUsuario(id_usuario);
            if (!pedidos) {
                throw new common_1.NotFoundException(`No se encontraron pedidos para el usuario con ID ${id_usuario}.`);
            }
            return pedidos;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener los pedidos del usuario.');
        }
    }
    async findOne(id_pedido) {
        try {
            const pedido = await this.pedidosService.findOne(id_pedido);
            if (!pedido) {
                throw new common_1.NotFoundException(`Pedido con ID ${id_pedido} no encontrado.`);
            }
            return pedido;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener el pedido.');
        }
    }
    async update(id_pedido, dto) {
        try {
            const pedidoActualizado = await this.pedidosService.update(id_pedido, dto);
            if (!pedidoActualizado) {
                throw new common_1.NotFoundException(`Pedido con ID ${id_pedido} no encontrado para actualizar.`);
            }
            return pedidoActualizado;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al actualizar el pedido.');
        }
    }
    async remove(id_pedido) {
        try {
            const pedidoEliminado = await this.pedidosService.remove(id_pedido);
            if (!pedidoEliminado) {
                throw new common_1.NotFoundException(`Pedido con ID ${id_pedido} no encontrado para eliminar.`);
            }
            return {
                message: `Pedido con ID ${id_pedido} eliminado correctamente.`,
                id: id_pedido,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            if (error.code === '23505') {
                throw new common_1.ConflictException('No se puede eliminar el pedido debido a dependencias o estado actual.');
            }
            throw new common_1.InternalServerErrorException('Error interno al eliminar el pedido.');
        }
    }
};
exports.PedidosController = PedidosController;
__decorate([
    (0, common_1.Post)('crear'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Roles.ADMIN, roles_enum_1.Roles.TRABAJADOR, roles_enum_1.Roles.USUARIO),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo pedido' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pedido creado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos (cantidades negativas, IDs inexistentes, campos vacíos).' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Falta el token de acceso.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes los roles necesarios.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto - El número de pedido o transacción ya existe.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al procesar el pedido en el servidor.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pedido_dto_1.CreatePedidoDto]),
    __metadata("design:returntype", Promise)
], PedidosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Roles.ADMIN, roles_enum_1.Roles.TRABAJADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los pedidos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pedidos obtenidos exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Solicitud inválida - Parámetros de consulta incorrectos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Token faltante o expirado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes los permisos necesarios.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener los pedidos.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('usuario/:id_usuario'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Roles.ADMIN, roles_enum_1.Roles.TRABAJADOR, roles_enum_1.Roles.USUARIO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener pedidos por ID de usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pedidos obtenidos exitosamente para el usuario.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID de usuario inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Token faltante o expirado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes los permisos necesarios.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontraron pedidos para el usuario.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener los pedidos del usuario.' }),
    __param(0, (0, common_1.Param)('id_usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidosController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)('detalle/:id_pedido'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Roles.ADMIN, roles_enum_1.Roles.TRABAJADOR, roles_enum_1.Roles.USUARIO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalles de un pedido por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pedido obtenido exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID de pedido inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Falta el token de acceso.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes los permisos suficientes.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pedido no encontrado por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener el pedido.' }),
    __param(0, (0, common_1.Param)('id_pedido', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PedidosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id_pedido'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Roles.ADMIN, roles_enum_1.Roles.TRABAJADOR, roles_enum_1.Roles.USUARIO),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un pedido por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pedido actualizado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID de pedido inválido o datos de actualización incorrectos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Falta el token de acceso.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes los permisos necesarios.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pedido no encontrado por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al actualizar el pedido.' }),
    __param(0, (0, common_1.Param)('id_pedido', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_pedido_dto_1.UpdatePedidoDto]),
    __metadata("design:returntype", Promise)
], PedidosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id_pedido'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Roles.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un pedido (Solo Administradores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pedido eliminado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID de pedido inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Falta el token de acceso.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes los permisos necesarios (Solo Administrador permitido).' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pedido no encontrado por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto - No se puede eliminar el pedido debido a dependencias o estado actual.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al eliminar el pedido.' }),
    __param(0, (0, common_1.Param)('id_pedido', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PedidosController.prototype, "remove", null);
exports.PedidosController = PedidosController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('pedidos'),
    __metadata("design:paramtypes", [pedidos_service_1.PedidosService])
], PedidosController);
//# sourceMappingURL=pedidos.controller.js.map