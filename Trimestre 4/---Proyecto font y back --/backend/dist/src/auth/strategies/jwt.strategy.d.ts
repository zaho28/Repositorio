import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id_rol_usuario: string;
        t_doc: import("@prisma/client").$Enums.tipo_documento_t_doc;
        id_usuario: string;
        codigo: string | null;
        nom_1: string;
        nom_2: string | null;
        ape_1: string;
        ape_2: string | null;
        correo: string;
        telefono: bigint;
        contrasena: string;
        img_perfil: string | null;
        codigo_visible: string | null;
        reset_codigo: string | null;
        reset_expira: Date | null;
        estado: number;
    }>;
}
export {};
