"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const productos_module_1 = require("./productos/productos.module");
const categorias_module_1 = require("./categorias/categorias.module");
const movimientos_module_1 = require("./movimientos/movimientos.module");
const pedidos_module_1 = require("./pedidos/pedidos.module");
const notificaciones_module_1 = require("./notificaciones/notificaciones.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./auth/guards/roles.guard");
const pedidos_personalizados_module_1 = require("./pedidos-personalizados/pedidos-personalizados.module");
const task_module_1 = require("./task/task.module");
const auth_middleware_1 = require("./auth/middleware/auth.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .exclude({ path: 'auth/login', method: common_1.RequestMethod.POST }, { path: 'auth/verify-code', method: common_1.RequestMethod.POST }, { path: 'usuarios', method: common_1.RequestMethod.POST }, { path: 'productos', method: common_1.RequestMethod.GET }, { path: 'uploads/(.*)', method: common_1.RequestMethod.GET })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
            productos_module_1.ProductosModule,
            categorias_module_1.CategoriasModule,
            movimientos_module_1.MovimientosModule,
            pedidos_module_1.PedidosModule,
            notificaciones_module_1.NotificacionesModule,
            pedidos_personalizados_module_1.PedidosPersonalizadosModule,
            task_module_1.TaskModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map