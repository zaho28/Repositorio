import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): import("@prisma/client").Prisma.PrismaPromise<{
        nombre_c: import("@prisma/client").$Enums.categoria_nombre_c;
        id_categoria: number;
    }[]>;
    findAllClasificaciones(query: any): import("@prisma/client").Prisma.PrismaPromise<{
        id_clasificacion: number;
        nombre_clas: import("@prisma/client").$Enums.clasificacion_nombre_clas;
    }[]>;
}
