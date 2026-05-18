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
exports.MovimientosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MovimientosService = class MovimientosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        console.log('service - todos los movimientos:', JSON.stringify(query));
        return this.prisma.$queryRaw `
      SELECT 
        m.id_movimiento,
        m.Cantidad_m,
        m.fecha_m,
        m.observaciones,
        CASE m.id_m 
          WHEN 'M-E' THEN 'entrada'
          WHEN 'M-S' THEN 'salida'
        END AS tipo,
        m.id_m,
        tm.nom_movimiento AS tipo_movimiento,
        p.nom_producto,
        p.ruta_imagen,
        u.id_usuario,
        CONCAT(u.nom_1, ' ', u.ape_1) AS nombre_usuario,
        r.nombre_rol,
        CASE 
          WHEN m.observaciones LIKE '%Pedido #%' THEN 'Venta Online'
          WHEN m.observaciones LIKE '%Realizado por:%' THEN 'Manual (Admin)'
          ELSE 'Manual'
        END AS origen_movimiento
      FROM movimiento m
      JOIN tipo_movimiento tm ON m.id_m = tm.id_m
      JOIN producto p ON m.id_producto = p.id_producto
      JOIN usuario u ON m.id_usuario = u.id_usuario
      JOIN rol_usuario r ON u.id_rol_usuario = r.id_rol_usuario
      ORDER BY m.fecha_m DESC
    `;
    }
    async findOne(id) {
        console.log('service - movimiento por ID:', id);
        return this.prisma.movimiento.findFirst({
            where: { id_movimiento: id },
            include: {
                producto: { select: { nom_producto: true, ruta_imagen: true } },
                usuario: { select: { nom_1: true, ape_1: true } },
                tipo_movimiento: true,
            },
        });
    }
    async findByTipo(tipo) {
        console.log('service - movimientos por tipo:', tipo);
        return this.prisma.movimiento.findMany({
            where: { id_m: tipo },
            orderBy: { fecha_m: 'desc' },
            include: {
                producto: { select: { nom_producto: true, ruta_imagen: true } },
                usuario: { select: { nom_1: true, ape_1: true } },
            },
        });
    }
    async create(dto) {
        console.log('service - crear movimiento:', JSON.stringify(dto));
        return this.prisma.movimiento.create({
            data: {
                Cantidad_m: dto.Cantidad_m,
                fecha_m: new Date(),
                observaciones: dto.observaciones ?? null,
                id_m: dto.id_m === 'M-E' ? 'M_E' : 'M_S',
                id_producto: Number(dto.id_producto),
                id_usuario: String(dto.id_usuario),
                id_material: null,
            },
        });
    }
    async update(id, dto) {
        console.log('service - actualizar movimiento:', { id, dto });
        return this.prisma.movimiento.update({
            where: { id_movimiento: id },
            data: {
                Cantidad_m: dto.Cantidad_m,
                observaciones: dto.observaciones,
            },
        });
    }
    async remove(id) {
        console.log('service - eliminar movimiento:', id);
        return this.prisma.movimiento.delete({
            where: { id_movimiento: id },
        });
    }
    async resumenGeneral(desde, hasta) {
        const conditions = [];
        if (desde)
            conditions.push(`fecha_m >= '${desde}'`);
        if (hasta)
            conditions.push(`fecha_m <= DATE_ADD('${hasta}', INTERVAL 1 DAY)`);
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const results = await this.prisma.$queryRawUnsafe(`
      SELECT 
        SUM(CASE WHEN id_m = 'M-E' THEN Cantidad_m ELSE 0 END) as totalEntradas,
        SUM(CASE WHEN id_m = 'M-S' THEN Cantidad_m ELSE 0 END) as totalSalidas
      FROM movimiento ${where}
    `);
        return results[0] || { totalEntradas: 0, totalSalidas: 0 };
    }
    async porDia(desde, hasta) {
        const conditions = [];
        if (desde)
            conditions.push(`fecha_m >= '${desde}'`);
        if (hasta)
            conditions.push(`fecha_m <= DATE_ADD('${hasta}', INTERVAL 1 DAY)`);
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        return this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE_FORMAT(fecha_m, '%Y-%m-%d') as fecha,
        SUM(CASE WHEN id_m = 'M-E' THEN Cantidad_m ELSE 0 END) as entradas,
        SUM(CASE WHEN id_m = 'M-S' THEN Cantidad_m ELSE 0 END) as salidas
      FROM movimiento ${where}
      GROUP BY DATE_FORMAT(fecha_m, '%Y-%m-%d')
      ORDER BY fecha
    `);
    }
    async porTipo(desde, hasta) {
        const conditions = [];
        if (desde)
            conditions.push(`fecha_m >= '${desde}'`);
        if (hasta)
            conditions.push(`fecha_m <= DATE_ADD('${hasta}', INTERVAL 1 DAY)`);
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        return this.prisma.$queryRawUnsafe(`
      SELECT 
        CASE WHEN id_m = 'M-E' THEN 'Entrada' WHEN id_m = 'M-S' THEN 'Salida' END as tipo,
        COUNT(*) as cantidad,
        SUM(Cantidad_m) as total_unidades
      FROM movimiento ${where}
      GROUP BY id_m
    `);
    }
    async topProductos(desde, hasta, limit = 10) {
        const conditions = ['p.estado = 1'];
        if (desde)
            conditions.push(`m.fecha_m >= '${desde}'`);
        if (hasta)
            conditions.push(`m.fecha_m <= DATE_ADD('${hasta}', INTERVAL 1 DAY)`);
        const where = `WHERE ${conditions.join(' AND ')}`;
        return this.prisma.$queryRawUnsafe(`
      SELECT 
        p.id_producto,
        p.nom_producto as producto,
        p.stock_actual,
        p.stock_minimo,
        COUNT(m.id_movimiento) as total_movimientos,
        SUM(CASE WHEN m.id_m = 'M-E' THEN m.Cantidad_m ELSE 0 END) as entradas,
        SUM(CASE WHEN m.id_m = 'M-S' THEN m.Cantidad_m ELSE 0 END) as salidas
      FROM producto p
      LEFT JOIN movimiento m ON p.id_producto = m.id_producto
      ${where}
      GROUP BY p.id_producto, p.nom_producto, p.stock_actual, p.stock_minimo
      ORDER BY total_movimientos DESC
      LIMIT ${limit}
    `);
    }
    async resumenMensual() {
        const results = await this.prisma.$queryRaw `
      SELECT 
        DATE_FORMAT(fecha_m, '%Y-%m') as mes,
        DATE_FORMAT(fecha_m, '%b %Y') as mes_nombre,
        SUM(CASE WHEN id_m = 'M-E' THEN Cantidad_m ELSE 0 END) as entradas,
        SUM(CASE WHEN id_m = 'M-S' THEN Cantidad_m ELSE 0 END) as salidas
      FROM movimiento
      WHERE fecha_m >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(fecha_m, '%Y-%m')
      ORDER BY mes
    `;
        return results.map((r) => ({
            mes: r.mes_nombre,
            entradas: r.entradas,
            salidas: r.salidas,
        }));
    }
};
exports.MovimientosService = MovimientosService;
exports.MovimientosService = MovimientosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MovimientosService);
//# sourceMappingURL=movimientos.service.js.map