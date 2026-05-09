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
exports.PedidosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PedidosService = class PedidosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        console.log('controller - Crear pedido:', JSON.stringify(dto));
        const { items, id_usuario, metodo_pago, subtotal, total } = dto;
        if (!items || items.length === 0 || !id_usuario || !metodo_pago) {
            throw new common_1.BadRequestException('Faltan datos obligatorios (items, id_usuario, metodo_pago)');
        }
        return this.prisma.$transaction(async (tx) => {
            const pedido = await tx.pedido.create({
                data: {
                    fecha: new Date(),
                    estado: 'Pendiente',
                    id_usuario,
                    id_tipo: 'P_E',
                },
            });
            const resultados = [];
            for (const item of items) {
                const { id_producto, cantidad, precio } = item;
                const producto = await tx.producto.findFirst({
                    where: { id_producto, estado: true },
                });
                if (!producto) {
                    throw new common_1.NotFoundException(`Producto ${id_producto} no encontrado`);
                }
                if (producto.stock_actual < cantidad) {
                    throw new common_1.BadRequestException(`Stock insuficiente para ${producto.nom_producto}. Disponible: ${producto.stock_actual}, Solicitado: ${cantidad}`);
                }
                await tx.producto.update({
                    where: { id_producto },
                    data: {
                        stock_actual: { decrement: cantidad },
                        ultima_actualiz: new Date(),
                    },
                });
                await tx.detalles_pedido.create({
                    data: {
                        descrip_detalles: `${producto.nom_producto} - $${precio}`,
                        cantidad,
                        id_pedido: pedido.id_pedido,
                        id_producto,
                    },
                });
                await tx.movimiento.create({
                    data: {
                        Cantidad_m: cantidad,
                        fecha_m: new Date(),
                        observaciones: `Venta Online - Pedido #${pedido.id_pedido}`,
                        id_m: 'M_S',
                        id_producto,
                        id_usuario,
                    },
                });
                resultados.push({
                    producto: producto.nom_producto,
                    cantidad,
                    stock_restante: producto.stock_actual - cantidad,
                });
            }
            const num_ticket = Math.floor(100000 + Math.random() * 900000);
            const ticket = await tx.ticket_compra.create({
                data: {
                    num_ticket,
                    fecha_emision: new Date(),
                    sub_total: subtotal,
                    total_ticket: total,
                    id_pedido: pedido.id_pedido,
                    id_estado: 'E_pd',
                    id_met_pago: 'Mtd_PD',
                },
            });
            return {
                success: true,
                message: 'Pedido creado con éxito',
                data: {
                    id_pedido: pedido.id_pedido,
                    num_ticket,
                    id_ticket: ticket.id_ticket_c,
                    productos_procesados: resultados.length,
                    detalles: resultados,
                },
            };
        });
    }
    async findByUsuario(id_usuario) {
        console.log('service - pedidos por usuario:', JSON.stringify({ id_usuario }));
        return this.prisma.pedido.findMany({
            where: { id_usuario },
            orderBy: { fecha: 'desc' },
            include: {
                ticket_compra: {
                    include: {
                        estado_pago: true,
                        metodo_pago: true,
                    },
                },
                detalles_pedido: {
                    include: {
                        producto: {
                            select: {
                                nom_producto: true,
                                precio_unitario: true,
                                ruta_imagen: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findAll(query) {
        console.log('service - todos los pedidos:', JSON.stringify(query));
        return this.prisma.pedido.findMany({
            orderBy: { fecha: 'desc' },
            include: {
                usuario: {
                    select: {
                        nom_1: true,
                        ape_1: true,
                        telefono: true,
                        correo: true,
                    },
                },
                ticket_compra: {
                    include: {
                        estado_pago: true,
                        metodo_pago: true,
                    },
                },
                detalles_pedido: true,
            },
        });
    }
    async findOne(id_pedido) {
        console.log('service - detalle de pedido:', JSON.stringify({ id_pedido }));
        const pedido = await this.prisma.pedido.findFirst({
            where: { id_pedido },
            include: {
                usuario: {
                    select: {
                        nom_1: true,
                        ape_1: true,
                        correo: true,
                        telefono: true,
                    },
                },
                ticket_compra: {
                    include: {
                        estado_pago: true,
                        metodo_pago: true,
                    },
                },
                detalles_pedido: {
                    include: {
                        producto: {
                            select: {
                                nom_producto: true,
                                precio_unitario: true,
                                ruta_imagen: true,
                            },
                        },
                    },
                },
            },
        });
        if (!pedido) {
            throw new common_1.NotFoundException(`Pedido ${id_pedido} no encontrado`);
        }
        return pedido;
    }
    async update(id_pedido, dto) {
        console.log('service - actualizar pedido:', { id_pedido, dto });
        await this.findOne(id_pedido);
        return this.prisma.pedido.update({
            where: { id_pedido },
            data: { estado: dto.estado },
        });
    }
    async remove(id_pedido) {
        console.log('service - eliminar pedido:', JSON.stringify({ id_pedido }));
        await this.findOne(id_pedido);
        return this.prisma.pedido.delete({
            where: { id_pedido },
        });
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PedidosService);
//# sourceMappingURL=pedidos.service.js.map