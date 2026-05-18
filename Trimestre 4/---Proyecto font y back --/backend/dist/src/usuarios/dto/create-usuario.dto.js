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
exports.CreateUsuarioDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUsuarioDto {
    id_usuario;
    nom_1;
    nom_2;
    ape_1;
    ape_2;
    correo;
    telefono;
    contrasena;
    codigo;
    id_rol_usuario;
    t_doc;
    img_perfil;
    estado;
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID es obligatorio' }),
    (0, class_validator_1.MaxLength)(15, { message: 'El ID no puede tener más de 15 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "id_usuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El primer nombre es obligatorio' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El primer nombre no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nom_1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50, { message: 'El segundo nombre no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nom_2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El primer apellido es obligatorio' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El primer apellido no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "ape_1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50, { message: 'El segundo apellido no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "ape_2", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo no es válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo es obligatorio' }),
    (0, class_validator_1.MaxLength)(40, { message: 'El correo no puede tener más de 40 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El teléfono es obligatorio' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "contrasena", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "codigo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El rol es obligatorio' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "id_rol_usuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de documento es obligatorio' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "t_doc", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "img_perfil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUsuarioDto.prototype, "estado", void 0);
//# sourceMappingURL=create-usuario.dto.js.map