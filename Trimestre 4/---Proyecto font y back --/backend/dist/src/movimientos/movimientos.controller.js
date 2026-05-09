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
exports.MovimientosController = void 0;
const common_1 = require("@nestjs/common");
const movimientos_service_1 = require("./movimientos.service");
const create_movimiento_dto_1 = require("./dto/create-movimiento.dto");
const update_movimiento_dto_1 = require("./dto/update-movimiento.dto");
const swagger_1 = require("@nestjs/swagger");
let MovimientosController = class MovimientosController {
    movimientosService;
    constructor(movimientosService) {
        this.movimientosService = movimientosService;
    }
    async findAll(query) {
        try {
            return await this.movimientosService.findAll(query);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener la lista de movimientos ');
        }
    }
    async resumenGeneral(desde, hasta) {
        try {
            return await this.movimientosService.resumenGeneral(desde, hasta);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener el resumen general.');
        }
    }
    async porDia(desde, hasta) {
        try {
            return await this.movimientosService.porDia(desde, hasta);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener los movimientos por día.');
        }
    }
    async porTipo(desde, hasta) {
        try {
            return await this.movimientosService.porTipo(desde, hasta);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener los movimientos por tipo.');
        }
    }
    async topProductos(desde, hasta, limit) {
        try {
            const parsedLimit = limit ? parseInt(limit, 10) : 10;
            if (limit && isNaN(parsedLimit)) {
                throw new common_1.BadRequestException('El parametro limit debe de ser un nùmero valido.');
            }
            return await this.movimientosService.topProductos(desde, hasta, limit ? parseInt(limit) : 10);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener el TOP productos mas vendidos.');
        }
    }
    async resumenMensual() {
        try {
            const resumen = await this.movimientosService.resumenMensual();
            if (!resumen) {
                throw new common_1.NotFoundException('No se encontraron movimientos para generar el resumen mensual.');
            }
            return resumen;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener el resumen mensual.');
        }
    }
    async findByTipo(tipo) {
        try {
            const movimientos = await this.movimientosService.findByTipo(tipo);
            if (!movimientos || movimientos.length === 0) {
                throw new common_1.NotFoundException(`No se encontraron movimientos por el tipo: ${tipo}`);
            }
            return movimientos;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
        }
        throw new common_1.InternalServerErrorException('Error interno al obtener los movimientos por tipo.');
    }
    async findOne(id) {
        try {
            const movimiento = await this.movimientosService.findOne(id);
            if (!movimiento) {
                throw new common_1.NotFoundException(`No se encontró un movimiento con el ID: ${id}`);
            }
            return movimiento;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener el movimiento por ID.');
        }
    }
    async create(createMovimientoDto) {
        try {
            return await this.movimientosService.create(createMovimientoDto);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error.code === '23503') {
                throw new common_1.NotFoundException('No se puede crear el movimiento: El producto no existe.');
            }
            throw new common_1.InternalServerErrorException('Error interno al registrar el nuevo movimiento.');
        }
    }
    async update(id, updateMovimientoDto) {
        try {
            const movimientosActualizado = await this.movimientosService.update(id, updateMovimientoDto);
            if (!movimientosActualizado) {
                throw new common_1.NotFoundException(`No se encontró un movimiento con el ID: ${id}`);
            }
            return movimientosActualizado;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al actualizar el movimiento.');
        }
    }
    async remove(id) {
        try {
            const resultado = await this.movimientosService.remove(id);
            if (!resultado) {
                throw new common_1.NotFoundException(`No se encontró un movimiento con el ID: ${id}`);
            }
            return {
                message: 'Movimiento eliminado exitosamente.',
                id: id,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            if (error.code === '23503') {
                throw new common_1.ConflictException('No se puede eliminar el movimiento: Existen registros relacionados que dependen de este movimiento.');
            }
            throw new common_1.InternalServerErrorException('Error interno al eliminar el movimiento.');
        }
    }
};
exports.MovimientosController = MovimientosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de moviminetos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de moviminetos obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado - Token faltante.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes permisos necesarios.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al consultar la lista de movimientos.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('resumen-general'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener resumen general' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resumen general obtenido exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes los permisos necesarios.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener el resumen general.' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "resumenGeneral", null);
__decorate([
    (0, common_1.Get)('por-dia'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por día.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos por día obtenidos exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener los movimientos por día. ' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "porDia", null);
__decorate([
    (0, common_1.Get)('por-tipo'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos por tipo obtenidos exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener movimientos por tipo.' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "porTipo", null);
__decorate([
    (0, common_1.Get)('top-productos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener TOP productos mas vendidos.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'TOP productos mas vendidos obtenidos exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener el TOP productos mas vendidos.' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "topProductos", null);
__decorate([
    (0, common_1.Get)('resumen-mensual'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener resumen mensual.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resumen mensual obtenido exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prihibido - No tienes permisos necesarios.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener el resumen mensual.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "resumenMensual", null);
__decorate([
    (0, common_1.Get)('tipo/:tipo'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos por tipo obtenidos exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontraron movimientos para el tipo especificado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener los movimientos por tipo.' }),
    __param(0, (0, common_1.Param)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimiento por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento obtenido exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID invalido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontró un movimiento con el ID especificado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener el movimiento por ID.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo movimiento.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movimiento registrado exitosamente y stock actualizado.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'El producto asociado al movimiento no existe.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al registrar el nuevo movimiento.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movimiento_dto_1.CreateMovimientoDto]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un movimiento existente.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento actualizado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes permisos suficientes.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontró un movimiento.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al actualizar el movimiento.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_movimiento_dto_1.UpdateMovimientoDto]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un movimiento por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento eliminado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID invalido.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - No tienes permisos suficientes.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontró un movimiento con el ID especificado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al eliminar el movimiento.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "remove", null);
exports.MovimientosController = MovimientosController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('movimientos'),
    __metadata("design:paramtypes", [movimientos_service_1.MovimientosService])
], MovimientosController);
//# sourceMappingURL=movimientos.controller.js.map