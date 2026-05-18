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
exports.NotificacionesController = void 0;
const common_1 = require("@nestjs/common");
const notificaciones_service_1 = require("./notificaciones.service");
const swagger_1 = require("@nestjs/swagger");
let NotificacionesController = class NotificacionesController {
    notificacionesService;
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }
    findAll(query) {
        console.log('controller - todas las notificaciones:', JSON.stringify(query));
        try {
            return this.notificacionesService.findAll(query);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener las notificaciones');
        }
    }
    count(query) {
        console.log('controller - contar notificaciones:', JSON.stringify(query));
        try {
            return this.notificacionesService.count(query);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al contar notificaciones');
        }
    }
    stockBajo(query) {
        console.log('controller - notificaciones de stock bajo:', JSON.stringify(query));
        try {
            return this.notificacionesService.stockBajo(query);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener notificaciones de stock bajo');
        }
    }
    agotados(query) {
        console.log('controller - notificaciones de productos agotados:', JSON.stringify(query));
        try {
            return this.notificacionesService.agotados(query);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener notificaciones de productos agotados');
        }
    }
    pedidosRecientes(dias) {
        console.log(`controller - notificaciones de pedidos recientes | días: ${dias}`);
        try {
            return this.notificacionesService.pedidosRecientes(dias);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener notificaciones de pedidos recientes');
        }
    }
    estadisticas(query) {
        console.log('controller - estadísticas:', JSON.stringify(query));
        try {
            return this.notificacionesService.estadisticas(query);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error interno al obtener estadísticas de notificaciones');
        }
    }
};
exports.NotificacionesController = NotificacionesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las notificaciones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de notificaciones obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Contar notificaciones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conteo generado con exito.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al procesar datos' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "count", null);
__decorate([
    (0, common_1.Get)('stock-bajo'),
    (0, swagger_1.ApiOperation)({ summary: 'Notificaciones de stock bajo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificaciones de stock bajo obtenidas exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "stockBajo", null);
__decorate([
    (0, common_1.Get)('agotados'),
    (0, swagger_1.ApiOperation)({ summary: 'Notificaciones de productos agotados' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificaciones de productos agotados obtenidas exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "agotados", null);
__decorate([
    (0, common_1.Get)('pedidos-recientes'),
    (0, swagger_1.ApiOperation)({ summary: 'Notificaciones de pedidos recientes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificaciones de pedidos recientes obtenidas exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos.' }),
    __param(0, (0, common_1.Query)('dias', new common_1.DefaultValuePipe(7), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "pedidosRecientes", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas de notificaciones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas de notificaciones obtenidas exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al obtener los datos.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "estadisticas", null);
exports.NotificacionesController = NotificacionesController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('notificaciones'),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], NotificacionesController);
//# sourceMappingURL=notificaciones.controller.js.map