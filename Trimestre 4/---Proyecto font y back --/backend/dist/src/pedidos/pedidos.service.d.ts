import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
export declare class PedidosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePedidoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_pedido: number;
            num_ticket: number;
            id_ticket: number;
            productos_procesados: number;
            detalles: {
                producto: string;
                cantidad: number;
                stock_restante: number;
            }[];
        };
    }>;
    findByUsuario(id_usuario: string): Promise<({
        detalles_pedido: ({
            producto: {
                ruta_imagen: string | null;
                nom_producto: string;
                precio_unitario: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id_producto: number;
            cantidad: number;
            id_pedido: number;
            descrip_detalles: string;
            id_detalles: number;
        })[];
        ticket_compra: ({
            estado_pago: {
                id_estado: import("@prisma/client").$Enums.estado_pago_id_estado;
                nom_metodo: import("@prisma/client").$Enums.estado_pago_nom_metodo;
            };
            metodo_pago: {
                nom_metodo: import("@prisma/client").$Enums.metodo_pago_nom_metodo;
                id_met_pago: import("@prisma/client").$Enums.metodo_pago_id_met_pago;
            };
        } & {
            id_estado: import("@prisma/client").$Enums.estado_pago_id_estado;
            id_pedido: number;
            num_ticket: number;
            fecha_emision: Date;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            total_ticket: import("@prisma/client/runtime/library").Decimal;
            id_ticket_c: number;
            id_met_pago: import("@prisma/client").$Enums.metodo_pago_id_met_pago;
        }) | null;
    } & {
        id_usuario: string;
        estado: string;
        fecha: Date;
        id_pedido: number;
        id_tipo: import("@prisma/client").$Enums.tipo_pedido_id_tipo;
    })[]>;
    findAll(query: any): Promise<({
        usuario: {
            nom_1: string;
            ape_1: string;
            correo: string;
            telefono: bigint;
        };
        detalles_pedido: {
            id_producto: number;
            cantidad: number;
            id_pedido: number;
            descrip_detalles: string;
            id_detalles: number;
        }[];
        ticket_compra: ({
            estado_pago: {
                id_estado: import("@prisma/client").$Enums.estado_pago_id_estado;
                nom_metodo: import("@prisma/client").$Enums.estado_pago_nom_metodo;
            };
            metodo_pago: {
                nom_metodo: import("@prisma/client").$Enums.metodo_pago_nom_metodo;
                id_met_pago: import("@prisma/client").$Enums.metodo_pago_id_met_pago;
            };
        } & {
            id_estado: import("@prisma/client").$Enums.estado_pago_id_estado;
            id_pedido: number;
            num_ticket: number;
            fecha_emision: Date;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            total_ticket: import("@prisma/client/runtime/library").Decimal;
            id_ticket_c: number;
            id_met_pago: import("@prisma/client").$Enums.metodo_pago_id_met_pago;
        }) | null;
    } & {
        id_usuario: string;
        estado: string;
        fecha: Date;
        id_pedido: number;
        id_tipo: import("@prisma/client").$Enums.tipo_pedido_id_tipo;
    })[]>;
    findOne(id_pedido: number): Promise<{
        usuario: {
            nom_1: string;
            ape_1: string;
            correo: string;
            telefono: bigint;
        };
        detalles_pedido: ({
            producto: {
                ruta_imagen: string | null;
                nom_producto: string;
                precio_unitario: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id_producto: number;
            cantidad: number;
            id_pedido: number;
            descrip_detalles: string;
            id_detalles: number;
        })[];
        ticket_compra: ({
            estado_pago: {
                id_estado: import("@prisma/client").$Enums.estado_pago_id_estado;
                nom_metodo: import("@prisma/client").$Enums.estado_pago_nom_metodo;
            };
            metodo_pago: {
                nom_metodo: import("@prisma/client").$Enums.metodo_pago_nom_metodo;
                id_met_pago: import("@prisma/client").$Enums.metodo_pago_id_met_pago;
            };
        } & {
            id_estado: import("@prisma/client").$Enums.estado_pago_id_estado;
            id_pedido: number;
            num_ticket: number;
            fecha_emision: Date;
            sub_total: import("@prisma/client/runtime/library").Decimal;
            total_ticket: import("@prisma/client/runtime/library").Decimal;
            id_ticket_c: number;
            id_met_pago: import("@prisma/client").$Enums.metodo_pago_id_met_pago;
        }) | null;
    } & {
        id_usuario: string;
        estado: string;
        fecha: Date;
        id_pedido: number;
        id_tipo: import("@prisma/client").$Enums.tipo_pedido_id_tipo;
    }>;
    update(id_pedido: number, dto: UpdatePedidoDto): Promise<{
        id_usuario: string;
        estado: string;
        fecha: Date;
        id_pedido: number;
        id_tipo: import("@prisma/client").$Enums.tipo_pedido_id_tipo;
    }>;
    remove(id_pedido: number): Promise<{
        id_usuario: string;
        estado: string;
        fecha: Date;
        id_pedido: number;
        id_tipo: import("@prisma/client").$Enums.tipo_pedido_id_tipo;
    }>;
}
