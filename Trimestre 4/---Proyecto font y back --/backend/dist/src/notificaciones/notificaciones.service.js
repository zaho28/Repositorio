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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificacionesService = class NotificacionesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        const [stockBajo, agotados, pedidos] = await Promise.all([
            this.prisma.producto.findMany({
                where: {
                    estado: true,
                    stock_actual: { lte: this.prisma.producto.fields.stock_minimo, gt: 0 },
                },
            }),
            this.prisma.producto.findMany({
                where: { estado: true, stock_actual: 0 },
            }),
            this.prisma.pedido.findMany({
                where: { fecha: { gte: hace7Dias } },
                orderBy: { fecha: 'desc' },
                take: 100,
                include: { ticket_compra: true },
            }),
        ]);
        const idUsuarios = [...new Set(pedidos.map((p) => p.id_usuario))];
        const usuarios = await this.prisma.usuario.findMany({
            where: { id_usuario: { in: idUsuarios } },
        });
        const usuarioMap = Object.fromEntries(usuarios.map((u) => [u.id_usuario, u]));
        const notifStockBajo = await this._getStockBajo();
        const notifAgotados = await this._getAgotados();
        const notifPedidos = pedidos.map((p) => {
            const usuario = usuarioMap[p.id_usuario];
            const nombre = usuario ? `${usuario.nom_1} ${usuario.ape_1}` : p.id_usuario;
            const ticket = p.ticket_compra?.[0];
            const tipo_pedido = p.id_tipo === 'P_P' ? 'Personalizado' : 'Estándar';
            console.log('controller - todas las notificaciones:', JSON.stringify(query));
            return {
                tipo: 'pedido',
                id_notificacion: `pedido-${p.id_pedido}`,
                id_producto: p.id_pedido,
                nom_producto: nombre,
                stock_actual: null,
                stock_minimo: null,
                fecha: p.fecha,
                mensaje: 'Se agregó nuevo pedido',
                detalles: `Id_pedido: ${ticket?.num_ticket ?? p.id_pedido} - Cliente: ${nombre} - ${tipo_pedido}`,
                ruta_destino: '/pedidos_realizados',
                clase_boton: 'pedido',
            };
        });
        return [...notifStockBajo, ...notifAgotados, ...notifPedidos]
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .slice(0, 100);
    }
    async count(query) {
        console.log('controller - contar notificaciones:', JSON.stringify(query));
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        const [alertas_stock_bajo, alertas_agotados, nuevos_pedidos] = await Promise.all([
            this.prisma.producto.count({
                where: { estado: true, stock_actual: { lte: this.prisma.producto.fields.stock_minimo, gt: 0 } },
            }),
            this.prisma.producto.count({ where: { estado: true, stock_actual: 0 } }),
            this.prisma.pedido.count({ where: { fecha: { gte: hace7Dias } } }),
        ]);
        return {
            alertas_stock_bajo,
            alertas_agotados,
            nuevos_pedidos,
            total_notificaciones: alertas_stock_bajo + alertas_agotados + nuevos_pedidos,
        };
    }
    async stockBajo(query) {
        console.log('controller - notificaciones de stock bajo:', JSON.stringify(query));
        return this._getStockBajo();
    }
    async agotados(query) {
        console.log('controller - notificaciones de productos agotados:', JSON.stringify(query));
        return this._getAgotados();
    }
    async pedidosRecientes(dias = 7) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - dias);
        const pedidos = await this.prisma.pedido.findMany({
            where: { fecha: { gte: fecha } },
            orderBy: { fecha: 'desc' },
        });
        const idUsuarios = [...new Set(pedidos.map((p) => p.id_usuario))];
        const usuarios = await this.prisma.usuario.findMany({
            where: { id_usuario: { in: idUsuarios } },
        });
        const usuarioMap = Object.fromEntries(usuarios.map((u) => [u.id_usuario, u]));
        const idPedidos = pedidos.map((p) => p.id_pedido);
        const tickets = await this.prisma.ticket_compra.findMany({
            where: { id_pedido: { in: idPedidos } },
        });
        const ticketMap = Object.fromEntries(tickets.map((t) => [t.id_pedido, t]));
        const detalles = await this.prisma.detalles_pedido.findMany({
            where: { id_pedido: { in: idPedidos } },
        });
        const detalleCount = detalles.reduce((acc, d) => {
            acc[d.id_pedido] = (acc[d.id_pedido] || 0) + 1;
            return acc;
        }, {});
        const resultado = pedidos.map((p) => {
            const u = usuarioMap[p.id_usuario];
            const t = ticketMap[p.id_pedido];
            return {
                id_pedido: p.id_pedido,
                fecha: p.fecha,
                estado: p.estado,
                id_tipo: p.id_tipo,
                cliente: u ? `${u.nom_1} ${u.ape_1}` : p.id_usuario,
                telefono: u?.telefono ?? null,
                correo: u?.correo ?? null,
                num_ticket: t?.num_ticket ?? null,
                total_ticket: t?.total_ticket ?? null,
                total_productos: detalleCount[p.id_pedido] ?? 0,
            };
        });
        console.log(`service - pedidos recientes | días: ${dias} | encontrados: ${resultado.length}`);
        return resultado;
    }
    async estadisticas(query) {
        console.log('controller - estadísticas:', JSON.stringify(query));
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        const [productos_agotados, productos_stock_bajo, pedidos_hoy, pedidos_semana, pedidos_pendientes] = await Promise.all([
            this.prisma.producto.count({ where: { estado: true, stock_actual: 0 } }),
            this.prisma.producto.count({
                where: { estado: true, stock_actual: { lte: this.prisma.producto.fields.stock_minimo, gt: 0 } },
            }),
            this.prisma.pedido.count({ where: { fecha: { gte: hoy } } }),
            this.prisma.pedido.count({ where: { fecha: { gte: hace7Dias } } }),
            this.prisma.pedido.count({ where: { estado: 'Pendiente' } }),
        ]);
        return { productos_agotados, productos_stock_bajo, pedidos_hoy, pedidos_semana, pedidos_pendientes };
    }
    async _getStockBajo() {
        const productos = await this.prisma.$queryRaw `
      SELECT p.id_producto, p.nom_producto, p.stock_actual, p.stock_minimo,
          p.ultima_actualiz, c.nombre_c as categoria, p.ruta_imagen
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 1 AND p.stock_actual <= p.stock_minimo AND p.stock_actual > 0
      ORDER BY p.stock_actual ASC
    `;
        return productos.map((p) => ({
            tipo: 'stock-bajo',
            id_notificacion: `stock-bajo-${p.id_producto}`,
            id_producto: p.id_producto,
            nom_producto: p.nom_producto,
            stock_actual: p.stock_actual,
            stock_minimo: p.stock_minimo,
            fecha: p.ultima_actualiz,
            mensaje: 'Alerta de bajo stock',
            detalles: `${p.nom_producto} - Últimas ${p.stock_actual} unidades`,
            ruta_destino: '/movimientos',
            clase_boton: 'stock',
            categoria: p.categoria,
            ruta_imagen: p.ruta_imagen,
        }));
    }
    async _getAgotados() {
        const productos = await this.prisma.$queryRaw `
      SELECT p.id_producto, p.nom_producto, p.stock_actual, p.stock_minimo,
            p.ultima_actualiz, c.nombre_c as categoria, p.ruta_imagen
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 1 AND p.stock_actual = 0
      ORDER BY p.ultima_actualiz DESC
    `;
        return productos.map((p) => ({
            tipo: 'agotado',
            id_notificacion: `agotado-${p.id_producto}`,
            id_producto: p.id_producto,
            nom_producto: p.nom_producto,
            stock_actual: p.stock_actual,
            stock_minimo: p.stock_minimo,
            fecha: p.ultima_actualiz,
            mensaje: 'Producto agotado',
            detalles: `${p.nom_producto} - SIN STOCK DISPONIBLE`,
            ruta_destino: '/movimientos',
            clase_boton: 'agotado',
            categoria: p.categoria,
            ruta_imagen: p.ruta_imagen,
        }));
    }
};
exports.NotificacionesService = NotificacionesService;
exports.NotificacionesService = NotificacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificacionesService);
//# sourceMappingURL=notificaciones.service.js.map