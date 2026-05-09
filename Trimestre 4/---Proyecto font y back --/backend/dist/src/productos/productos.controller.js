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
exports.ProductosController = void 0;
const common_1 = require("@nestjs/common");
const productos_service_1 = require("./productos.service");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const update_producto_dto_1 = require("./dto/update-producto.dto");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
let ProductosController = class ProductosController {
    productosService;
    constructor(productosService) {
        this.productosService = productosService;
    }
    async create(dto) {
        try {
            return await this.productosService.create(dto);
        }
        catch (error) {
            if (error.code === '23505')
                throw new common_1.ConflictException('El producto ya existe.');
            throw new common_1.InternalServerErrorException('Error al crear el producto.');
        }
    }
    async findAll(query) {
        try {
            return await this.productosService.findAll(query);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error al obtener el catalogo de productos.');
        }
    }
    async checkProducto(id) {
        try {
            const existe = await this.productosService.checkProducto(+id);
            if (!existe) {
                throw new common_1.NotFoundException('Producto no encontrado.');
            }
            return existe;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al verificar el producto.');
        }
    }
    async findOne(id) {
        try {
            const producto = await this.productosService.findOne(+id);
            if (!producto) {
                throw new common_1.NotFoundException('Producto no encontrado.');
            }
            return producto;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al obtener el producto.');
        }
    }
    async update(id, dto) {
        try {
            const productoActualizado = await this.productosService.update(+id, dto);
            if (!productoActualizado) {
                throw new common_1.NotFoundException('Producto no encontrado.');
            }
            return productoActualizado;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error.code === '23505') {
                throw new common_1.ConflictException('Ya existe un producto con este codigo o nombre.');
            }
            throw new common_1.InternalServerErrorException('Error al actualizar el producto.');
        }
    }
    async remove(id) {
        try {
            const resultado = await this.productosService.remove(id);
            if (!resultado) {
                throw new common_1.NotFoundException(`No se encontró el producto con ID ${id} para eliminar`);
            }
            return {
                message: `Producto con ID ${id} eliminado correctamente`,
                id: id
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            if (error.code === '23503') {
                throw new common_1.ConflictException('No se puede eliminar el producto porque está asociado a pedidos existentes. Considera desactivarlo en su lugar.');
            }
            throw new common_1.InternalServerErrorException('Ocurrió un error inesperado al eliminar el producto');
        }
    }
    async subirImagen(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('Debe proporcionar una imagen válida en el campo "imagen_producto"');
        }
        try {
            const productoActualizado = await this.productosService.actualizarImagen(id, file);
            if (!productoActualizado) {
                throw new common_1.NotFoundException(`No se encontró el producto con ID ${id} para asociar la imagen`);
            }
            return productoActualizado;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al intentar actualizar la imagen en la base de datos');
        }
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo producto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos del producto inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Ya existe un producto con este codigo o nombre.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una lista de productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Catalogo de productos obtenida exitosamente.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('check/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar si un producto existe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto existe.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID del producto inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al verificar el producto.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "checkProducto", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto obtenido exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID del producto inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al obtener el producto.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID del producto o datos inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Ya existe un producto con este codigo o nombre.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error al actualizar el producto.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_producto_dto_1.UpdateProductoDto]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto del sistema' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto eliminado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'El ID proporcionado no es un número válido.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - Solo el Administrador puede borrar productos.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'El producto que intentas eliminar no existe.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto - No se puede eliminar porque el producto tiene historial de ventas.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al intentar eliminar el producto.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/imagen'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen_producto', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const dir = './uploads/productos';
                (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (req, file, cb) => {
                const nombreUnico = `${req.params.id}-${Date.now()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, nombreUnico);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new common_1.BadRequestException('Formato de archivo no permitido. Use jpg, jpeg, png o webp'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Subir o actualizar la imagen de un producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imagen actualizada correctamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Archivo inválido o el campo "imagen_producto" no fue encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'El producto no existe.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno al procesar o guardar la imagen.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "subirImagen", null);
exports.ProductosController = ProductosController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('productos'),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ProductosController);
//# sourceMappingURL=productos.controller.js.map