export declare class CreateProductoDto {
    nom_producto: string;
    precio_unitario: number;
    stock_actual: number;
    stock_minimo: number;
    color?: string;
    talla?: string;
    tamaño?: string;
    descripcion: string;
    id_categoria: number;
    id_clasificacion?: number;
    ruta_imagen?: string;
    estado?: boolean;
}
