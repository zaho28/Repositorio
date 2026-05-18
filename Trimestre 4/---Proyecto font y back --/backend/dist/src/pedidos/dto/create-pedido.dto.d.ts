export declare class CreatePedidoItemDto {
    id_producto: number;
    cantidad: number;
    precio: number;
}
export declare class CreatePedidoDto {
    items: CreatePedidoItemDto[];
    id_usuario: string;
    metodo_pago: string;
    subtotal: number;
    total: number;
}
