export declare class MaterialItemDto {
    id_material: number;
    cantidad: number;
}
export declare class CreatePedidoPersonalizadoDto {
    id_usuario: string;
    tipo_producto: string;
    tamanio: string;
    metodo_pago: string;
    materiales: MaterialItemDto[];
}
