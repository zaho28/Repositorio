import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
export declare class MovimientosController {
    private readonly movimientosService;
    constructor(movimientosService: MovimientosService);
    findAll(query: any): Promise<any[]>;
    resumenGeneral(desde?: string, hasta?: string): Promise<any>;
    porDia(desde?: string, hasta?: string): Promise<any[]>;
    porTipo(desde?: string, hasta?: string): Promise<any[]>;
    topProductos(desde?: string, hasta?: string, limit?: string): Promise<any[]>;
    resumenMensual(): Promise<{
        mes: any;
        entradas: any;
        salidas: any;
    }[]>;
    findByTipo(tipo: string): Promise<({
        usuario: {
            nom_1: string;
            ape_1: string;
        };
        producto: {
            ruta_imagen: string | null;
            nom_producto: string;
        };
    } & {
        id_usuario: string;
        id_material: number | null;
        id_producto: number;
        Cantidad_m: number;
        observaciones: string | null;
        id_m: import("@prisma/client").$Enums.tipo_movimiento_id_m;
        id_movimiento: number;
        fecha_m: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        usuario: {
            nom_1: string;
            ape_1: string;
        };
        producto: {
            ruta_imagen: string | null;
            nom_producto: string;
        };
        tipo_movimiento: {
            id_m: import("@prisma/client").$Enums.tipo_movimiento_id_m;
            nom_movimiento: import("@prisma/client").$Enums.tipo_movimiento_nom_movimiento;
        };
    } & {
        id_usuario: string;
        id_material: number | null;
        id_producto: number;
        Cantidad_m: number;
        observaciones: string | null;
        id_m: import("@prisma/client").$Enums.tipo_movimiento_id_m;
        id_movimiento: number;
        fecha_m: Date | null;
    }>;
    create(createMovimientoDto: CreateMovimientoDto): Promise<{
        id_usuario: string;
        id_material: number | null;
        id_producto: number;
        Cantidad_m: number;
        observaciones: string | null;
        id_m: import("@prisma/client").$Enums.tipo_movimiento_id_m;
        id_movimiento: number;
        fecha_m: Date | null;
    }>;
    update(id: number, updateMovimientoDto: UpdateMovimientoDto): Promise<{
        id_usuario: string;
        id_material: number | null;
        id_producto: number;
        Cantidad_m: number;
        observaciones: string | null;
        id_m: import("@prisma/client").$Enums.tipo_movimiento_id_m;
        id_movimiento: number;
        fecha_m: Date | null;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
