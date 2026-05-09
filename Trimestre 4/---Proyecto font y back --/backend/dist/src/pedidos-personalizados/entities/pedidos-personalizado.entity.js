"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = exports.PedidoPersonalizado = void 0;
class PedidoPersonalizado {
    id_ped_personal;
    id_pedido;
    tipo_producto;
    tamanio;
    precio_total;
}
exports.PedidoPersonalizado = PedidoPersonalizado;
class Material {
    id_material;
    nombre;
    tipo;
    unidad;
    precio_unitario;
    stock_actual;
    stock_minimo;
    ruta_imagen;
    estado;
}
exports.Material = Material;
//# sourceMappingURL=pedidos-personalizado.entity.js.map