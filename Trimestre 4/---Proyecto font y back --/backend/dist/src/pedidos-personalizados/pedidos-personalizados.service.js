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
exports.PedidosPersonalizadosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PedidosPersonalizadosService = class PedidosPersonalizadosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMateriales(query) {
        console.log('controller - todos los materiales disponibles:', JSON.stringify(query));
        return this.prisma.material.findMany({
            where: { estado: true },
            select: {
                id_material: true,
                nombre: true,
                tipo: true,
                unidad: true,
                precio_unitario: true,
                stock_actual: true,
                ruta_imagen: true,
            },
        });
    }
    async getMaterialesPorTipo(tipo) {
        console.log('controller - obtener materiales por tipo:', JSON.stringify(tipo));
        return this.prisma.material.findMany({
            where: { estado: true, tipo: tipo },
            select: {
                id_material: true,
                nombre: true,
                tipo: true,
                unidad: true,
                precio_unitario: true,
                stock_actual: true,
                ruta_imagen: true,
            },
        });
    }
    async getColoresMaterial(id_material) {
        return this.prisma.material_color.findMany({
            where: { id_material, estado: true },
            select: { id_color: true, nombre: true, codigo_hex: true },
        });
    }
    async getDisenosMaterial(id_material) {
        return this.prisma.material_diseno.findMany({
            where: { id_material, estado: true },
            select: { id_diseno: true, nombre: true, ruta_imagen: true },
        });
    }
    async crearMaterial(dto) {
        return this.prisma.material.create({
            data: {
                nombre: dto.nombre,
                tipo: dto.tipo,
                unidad: dto.unidad,
                precio_unitario: dto.precio_unitario,
                stock_actual: dto.stock_actual,
                stock_minimo: dto.stock_minimo,
                estado: true,
            },
        });
    }
    async actualizarMaterial(id, dto) {
        const material = await this.prisma.material.findUnique({
            where: { id_material: id }
        });
        if (!material)
            throw new common_1.NotFoundException(`Material ${id} no encontrado`);
        return this.prisma.material.update({
            where: { id_material: id },
            data: {
                ...dto,
                tipo: dto.tipo,
                unidad: dto.unidad,
            },
        });
    }
    async actualizarImagenMaterial(id, file) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo');
        const material = await this.prisma.material.findUnique({
            where: { id_material: id }
        });
        if (!material)
            throw new common_1.NotFoundException(`Material ${id} no encontrado`);
        const ruta_imagen = `/uploads/materiales/${file.filename}`;
        await this.prisma.material.update({
            where: { id_material: id },
            data: { ruta_imagen },
        });
        return { statusCode: 200, message: 'Imagen actualizada', ruta_imagen };
    }
    async crearPedido(dto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id_usuario: dto.id_usuario },
            select: { nom_1: true, ape_1: true, correo: true, telefono: true, id_usuario: true },
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        for (const item of dto.materiales) {
            const material = await this.prisma.material.findUnique({
                where: { id_material: item.id_material },
            });
            if (!material || !material.estado) {
                throw new common_1.NotFoundException(`Material ${item.id_material} no encontrado`);
            }
            if (material.stock_actual < item.cantidad) {
                throw new common_1.BadRequestException(`Stock insuficiente para ${material.nombre}. Disponible: ${material.stock_actual}`);
            }
        }
        let precio_total = 0;
        const detalles = [];
        for (const item of dto.materiales) {
            const material = await this.prisma.material.findUnique({
                where: { id_material: item.id_material },
            });
            const subtotal = Number(material.precio_unitario) * item.cantidad;
            precio_total += subtotal;
            detalles.push({
                id_material: item.id_material,
                cantidad: item.cantidad,
                subtotal,
                nombre: material.nombre,
                unidad: material.unidad,
            });
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const pedido = await tx.pedido.create({
                data: {
                    fecha: new Date(),
                    estado: 'Pendiente',
                    id_usuario: dto.id_usuario,
                    id_tipo: 'P_P',
                },
            });
            const pedidoPersonal = await tx.pedido_personalizado.create({
                data: {
                    id_pedido: pedido.id_pedido,
                    tipo_producto: (dto.tipo_producto === 'Sábana' ? 'Sabana' : dto.tipo_producto),
                    tamanio: dto.tamanio,
                    precio_total,
                    detalles: {
                        create: detalles.map(({ id_material, cantidad, subtotal }) => ({
                            id_material, cantidad, subtotal,
                        })),
                    },
                },
            });
            const numTicket = Math.floor(100000 + Math.random() * 900000);
            await tx.ticket_compra.create({
                data: {
                    num_ticket: numTicket,
                    fecha_emision: new Date(),
                    sub_total: precio_total,
                    total_ticket: precio_total,
                    id_pedido: pedido.id_pedido,
                    id_estado: 'E_pt',
                    id_met_pago: dto.metodo_pago,
                },
            });
            for (const item of detalles) {
                await tx.material.update({
                    where: { id_material: item.id_material },
                    data: { stock_actual: { decrement: item.cantidad } },
                });
            }
            return { pedido, pedidoPersonal, num_ticket: numTicket };
        });
        console.log('service - crear pedido personalizado:', JSON.stringify(dto));
        return {
            success: true,
            message: 'Pedido personalizado creado exitosamente',
            id_pedido: result.pedido.id_pedido,
            num_ticket: result.num_ticket,
            precio_total,
            usuario: {
                nombre: `${usuario.nom_1} ${usuario.ape_1}`,
                id_usuario: usuario.id_usuario,
                correo: usuario.correo,
                telefono: usuario.telefono?.toString(),
            },
            tipo_producto: dto.tipo_producto,
            tamanio: dto.tamanio,
            materiales: detalles,
        };
    }
    async findAll(query) {
        console.log('controller - obtener pedidos personalizados (admin/trabajador):', JSON.stringify(query));
        return this.prisma.pedido_personalizado.findMany({
            include: {
                pedido: {
                    select: { fecha: true, estado: true, id_usuario: true },
                },
                detalles: {
                    include: {
                        material: { select: { nombre: true, tipo: true, unidad: true } },
                    },
                },
            },
        });
    }
    async findByUsuario(id_usuario) {
        console.log('controller - obtener pedidos de un usuario:', JSON.stringify(id_usuario));
        return this.prisma.pedido_personalizado.findMany({
            where: {
                pedido: { id_usuario },
            },
            include: {
                pedido: { select: { fecha: true, estado: true } },
                detalles: {
                    include: {
                        material: { select: { nombre: true, tipo: true, unidad: true, ruta_imagen: true } },
                    },
                },
            },
        });
    }
};
exports.PedidosPersonalizadosService = PedidosPersonalizadosService;
exports.PedidosPersonalizadosService = PedidosPersonalizadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PedidosPersonalizadosService);
//# sourceMappingURL=pedidos-personalizados.service.js.map