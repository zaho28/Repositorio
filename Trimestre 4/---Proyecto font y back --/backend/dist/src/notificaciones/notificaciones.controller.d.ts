import { NotificacionesService } from './notificaciones.service';
export declare class NotificacionesController {
    private readonly notificacionesService;
    constructor(notificacionesService: NotificacionesService);
    findAll(query: any): Promise<({
        tipo: string;
        id_notificacion: string;
        id_producto: any;
        nom_producto: any;
        stock_actual: any;
        stock_minimo: any;
        fecha: any;
        mensaje: string;
        detalles: string;
        ruta_destino: string;
        clase_boton: string;
        categoria: any;
        ruta_imagen: any;
    } | {
        tipo: string;
        id_notificacion: string;
        id_producto: number;
        nom_producto: string;
        stock_actual: null;
        stock_minimo: null;
        fecha: Date;
        mensaje: string;
        detalles: string;
        ruta_destino: string;
        clase_boton: string;
    })[]>;
    count(query: any): Promise<{
        alertas_stock_bajo: number;
        alertas_agotados: number;
        nuevos_pedidos: number;
        total_notificaciones: number;
    }>;
    stockBajo(query: any): Promise<{
        tipo: string;
        id_notificacion: string;
        id_producto: any;
        nom_producto: any;
        stock_actual: any;
        stock_minimo: any;
        fecha: any;
        mensaje: string;
        detalles: string;
        ruta_destino: string;
        clase_boton: string;
        categoria: any;
        ruta_imagen: any;
    }[]>;
    agotados(query: any): Promise<{
        tipo: string;
        id_notificacion: string;
        id_producto: any;
        nom_producto: any;
        stock_actual: any;
        stock_minimo: any;
        fecha: any;
        mensaje: string;
        detalles: string;
        ruta_destino: string;
        clase_boton: string;
        categoria: any;
        ruta_imagen: any;
    }[]>;
    pedidosRecientes(dias: number): Promise<{
        id_pedido: number;
        fecha: Date;
        estado: string;
        id_tipo: import("@prisma/client").$Enums.tipo_pedido_id_tipo;
        cliente: string;
        telefono: bigint;
        correo: string;
        num_ticket: number;
        total_ticket: import("@prisma/client/runtime/library").Decimal;
        total_productos: number;
    }[]>;
    estadisticas(query: any): Promise<{
        productos_agotados: number;
        productos_stock_bajo: number;
        pedidos_hoy: number;
        pedidos_semana: number;
        pedidos_pendientes: number;
    }>;
}
