import { PedidosPersonalizadosService } from './pedidos-personalizados.service';
export declare class PedidosPersonalizadosController {
    private readonly service;
    constructor(service: PedidosPersonalizadosService);
    getMateriales(query: any): Promise<{
        nombre: string;
        id_material: number;
        ruta_imagen: string | null;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        stock_actual: number;
        tipo: import("@prisma/client").$Enums.material_tipo;
        unidad: import("@prisma/client").$Enums.material_unidad;
    }[]>;
    getMaterialesPorTipo(tipo: string): Promise<{
        nombre: string;
        id_material: number;
        ruta_imagen: string | null;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        stock_actual: number;
        tipo: import("@prisma/client").$Enums.material_tipo;
        unidad: import("@prisma/client").$Enums.material_unidad;
    }[]>;
    getColores(id: string): Promise<{
        nombre: string;
        codigo_hex: string | null;
        id_color: number;
    }[]>;
    getDisenos(id: string): Promise<{
        nombre: string;
        ruta_imagen: string | null;
        id_diseno: number;
    }[]>;
    crearMaterial(dto: {
        nombre: string;
        tipo: string;
        unidad: string;
        precio_unitario: number;
        stock_actual: number;
        stock_minimo: number;
    }): Promise<{
        estado: boolean | null;
        nombre: string;
        id_material: number;
        ruta_imagen: string | null;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        stock_actual: number;
        stock_minimo: number;
        tipo: import("@prisma/client").$Enums.material_tipo;
        unidad: import("@prisma/client").$Enums.material_unidad;
    }>;
    actualizarMaterial(id: string, dto: {
        nombre?: string;
        tipo?: string;
        unidad?: string;
        precio_unitario?: number;
        stock_actual?: number;
        stock_minimo?: number;
    }): Promise<{
        estado: boolean | null;
        nombre: string;
        id_material: number;
        ruta_imagen: string | null;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        stock_actual: number;
        stock_minimo: number;
        tipo: import("@prisma/client").$Enums.material_tipo;
        unidad: import("@prisma/client").$Enums.material_unidad;
    }>;
    subirImagenMaterial(id: string, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
        ruta_imagen: string;
    }>;
    crearPedido(dto: {
        id_usuario: string;
        tipo_producto: string;
        tamanio: string;
        metodo_pago: string;
        materiales: {
            id_material: number;
            cantidad: number;
        }[];
    }): Promise<{
        success: boolean;
        message: string;
        id_pedido: number;
        num_ticket: number;
        precio_total: number;
        usuario: {
            nombre: string;
            id_usuario: string;
            correo: string;
            telefono: string;
        };
        tipo_producto: string;
        tamanio: string;
        materiales: {
            id_material: number;
            cantidad: number;
            subtotal: number;
            nombre: string;
            unidad: string;
        }[];
    }>;
    findAll(query: any): Promise<({
        pedido: {
            id_usuario: string;
            estado: string;
            fecha: Date;
        };
        detalles: ({
            material: {
                nombre: string;
                tipo: import("@prisma/client").$Enums.material_tipo;
                unidad: import("@prisma/client").$Enums.material_unidad;
            };
        } & {
            id_material: number;
            cantidad: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            id_ped_personal: number;
            id_detalle: number;
        })[];
    } & {
        id_pedido: number;
        id_ped_personal: number;
        tipo_producto: import("@prisma/client").$Enums.pedido_personalizado_tipo_producto;
        tamanio: string;
        precio_total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findByUsuario(id_usuario: string): Promise<({
        pedido: {
            estado: string;
            fecha: Date;
        };
        detalles: ({
            material: {
                nombre: string;
                ruta_imagen: string | null;
                tipo: import("@prisma/client").$Enums.material_tipo;
                unidad: import("@prisma/client").$Enums.material_unidad;
            };
        } & {
            id_material: number;
            cantidad: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            id_ped_personal: number;
            id_detalle: number;
        })[];
    } & {
        id_pedido: number;
        id_ped_personal: number;
        tipo_producto: import("@prisma/client").$Enums.pedido_personalizado_tipo_producto;
        tamanio: string;
        precio_total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
}
