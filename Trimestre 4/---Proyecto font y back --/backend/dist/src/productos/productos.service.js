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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductosService = class ProductosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        return this.prisma.producto.findMany({
            where: { estado: true },
            include: {
                categoria: { select: { nombre_c: true } },
                clasificacion: { select: { nombre_clas: true } },
            },
        });
    }
    async findOne(id) {
        const producto = await this.prisma.producto.findFirst({
            where: { id_producto: id, estado: true },
            include: {
                categoria: { select: { nombre_c: true } },
                clasificacion: { select: { nombre_clas: true } },
            },
        });
        if (!producto)
            throw new common_1.NotFoundException(`Producto ${id} no encontrado`);
        return producto;
    }
    async create(dto) {
        console.log('service - crear producto:', JSON.stringify(dto));
        return this.prisma.producto.create({
            data: {
                nom_producto: dto.nom_producto,
                precio_unitario: dto.precio_unitario,
                stock_actual: dto.stock_actual,
                stock_minimo: dto.stock_minimo,
                ultima_actualiz: new Date(),
                color: dto.color ?? null,
                talla: dto.talla ?? null,
                tama_o: dto.tamaño ?? null,
                descripcion: dto.descripcion,
                id_categoria: dto.id_categoria,
                id_clasificacion: dto.id_clasificacion ?? 1,
                ruta_imagen: dto.ruta_imagen ?? null,
                estado: dto.estado ?? true,
            },
        });
    }
    async update(id, dto) {
        console.log('service - actualizar producto:', { id, dto });
        await this.findOne(id);
        const data = {};
        if (dto.nom_producto !== undefined)
            data.nom_producto = dto.nom_producto;
        if (dto.precio_unitario !== undefined)
            data.precio_unitario = dto.precio_unitario;
        if (dto.stock_minimo !== undefined)
            data.stock_minimo = dto.stock_minimo;
        if (dto.color !== undefined)
            data.color = dto.color;
        if (dto.talla !== undefined)
            data.talla = dto.talla;
        if (dto.descripcion !== undefined)
            data.descripcion = dto.descripcion;
        if (dto.id_categoria !== undefined)
            data.id_categoria = dto.id_categoria;
        if (dto.id_clasificacion !== undefined)
            data.id_clasificacion = dto.id_clasificacion;
        if (dto.ruta_imagen !== undefined)
            data.ruta_imagen = dto.ruta_imagen;
        if (dto.estado !== undefined)
            data.estado = dto.estado;
        if (dto.tamaño !== undefined)
            data.tama_o = dto.tamaño;
        data.ultima_actualiz = new Date();
        const actualizado = await this.prisma.producto.update({
            where: { id_producto: id },
            data,
        });
        return {
            statusCode: 200,
            message: `Producto ${id} actualizado exitosamente`,
            data: actualizado,
        };
    }
    async remove(id) {
        console.log('service - eliminar producto:', JSON.stringify({ id }));
        await this.findOne(id);
        await this.prisma.producto.update({
            where: { id_producto: id },
            data: {
                estado: false,
                ultima_actualiz: new Date(),
            },
        });
        return {
            statusCode: 200,
            message: `Producto ${id} eliminado exitosamente`,
        };
    }
    async checkProducto(id) {
        const producto = await this.prisma.producto.findFirst({
            where: { id_producto: id, estado: true },
            select: {
                id_producto: true,
                nom_producto: true,
                stock_actual: true,
                precio_unitario: true,
            },
        });
        if (!producto)
            return { found: false, message: 'Producto no encontrado' };
        return { found: true, product: producto };
    }
    async actualizarImagen(id, file) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo');
        await this.findOne(id);
        const ruta_imagen = `/uploads/productos/${file.filename}`;
        await this.prisma.producto.update({
            where: { id_producto: id },
            data: {
                ruta_imagen,
                ultima_actualiz: new Date(),
            },
        });
        return {
            statusCode: 200,
            message: 'Imagen actualizada exitosamente',
            ruta_imagen,
        };
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductosService);
//# sourceMappingURL=productos.service.js.map