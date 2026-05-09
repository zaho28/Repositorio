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
exports.CreatePedidoDto = exports.CreatePedidoItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreatePedidoItemDto {
    id_producto;
    cantidad;
    precio;
}
exports.CreatePedidoItemDto = CreatePedidoItemDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID del producto es obligatorio' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePedidoItemDto.prototype, "id_producto", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La cantidad es obligatoria' }),
    (0, class_validator_1.Min)(1, { message: 'La cantidad debe ser un número positivo' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePedidoItemDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El precio es obligatorio' }),
    (0, class_validator_1.Min)(0, { message: 'El precio debe ser un número positivo' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePedidoItemDto.prototype, "precio", void 0);
class CreatePedidoDto {
    items;
    id_usuario;
    metodo_pago;
    subtotal;
    total;
}
exports.CreatePedidoDto = CreatePedidoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Los items del pedido son obligatorios' }),
    __metadata("design:type", Array)
], CreatePedidoDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID del usuario es obligatorio' }),
    __metadata("design:type", String)
], CreatePedidoDto.prototype, "id_usuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El método de pago es obligatorio' }),
    __metadata("design:type", String)
], CreatePedidoDto.prototype, "metodo_pago", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El subtotal debe ser un número positivo' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePedidoDto.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El impuesto debe ser un número positivo' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePedidoDto.prototype, "total", void 0);
//# sourceMappingURL=create-pedido.dto.js.map