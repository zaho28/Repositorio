import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    create(dto: CreateProductoDto): Promise<{
        descripcion: string;
        id_categoria: number;
        estado: boolean | null;
        ruta_imagen: string | null;
        nom_producto: string;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        stock_actual: number;
        stock_minimo: number;
        color: string | null;
        talla: string | null;
        id_clasificacion: number;
        id_producto: number;
        ultima_actualiz: Date;
        tama_o: string | null;
    }>;
    findAll(query: any): Promise<({
        categoria: {
            nombre_c: import("@prisma/client").$Enums.categoria_nombre_c;
        };
        clasificacion: {
            nombre_clas: import("@prisma/client").$Enums.clasificacion_nombre_clas;
        };
    } & {
        descripcion: string;
        id_categoria: number;
        estado: boolean | null;
        ruta_imagen: string | null;
        nom_producto: string;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        stock_actual: number;
        stock_minimo: number;
        color: string | null;
        talla: string | null;
        id_clasificacion: number;
        id_producto: number;
        ultima_actualiz: Date;
        tama_o: string | null;
    })[]>;
    checkProducto(id: string): Promise<{
        found: boolean;
        message: string;
        product?: undefined;
    } | {
        found: boolean;
        product: {
            nom_producto: string;
            precio_unitario: import("@prisma/client/runtime/library").Decimal;
            stock_actual: number;
            id_producto: number;
        };
        message?: undefined;
    }>;
    findOne(id: string): Promise<{
        categoria: {
            nombre_c: import("@prisma/client").$Enums.categoria_nombre_c;
        };
        clasificacion: {
            nombre_clas: import("@prisma/client").$Enums.clasificacion_nombre_clas;
        };
    } & {
        descripcion: string;
        id_categoria: number;
        estado: boolean | null;
        ruta_imagen: string | null;
        nom_producto: string;
        precio_unitario: import("@prisma/client/runtime/library").Decimal;
        stock_actual: number;
        stock_minimo: number;
        color: string | null;
        talla: string | null;
        id_clasificacion: number;
        id_producto: number;
        ultima_actualiz: Date;
        tama_o: string | null;
    }>;
    update(id: string, dto: UpdateProductoDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            descripcion: string;
            id_categoria: number;
            estado: boolean | null;
            ruta_imagen: string | null;
            nom_producto: string;
            precio_unitario: import("@prisma/client/runtime/library").Decimal;
            stock_actual: number;
            stock_minimo: number;
            color: string | null;
            talla: string | null;
            id_clasificacion: number;
            id_producto: number;
            ultima_actualiz: Date;
            tama_o: string | null;
        };
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    subirImagen(id: number, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
        ruta_imagen: string;
    }>;
}
