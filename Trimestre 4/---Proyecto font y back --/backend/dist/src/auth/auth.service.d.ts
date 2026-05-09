import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(correo: string, contrasena: string): Promise<{
        needs_code: boolean;
        user: any;
        success?: undefined;
    } | {
        success: boolean;
        user: any;
        needs_code?: undefined;
    }>;
    verifyCode(id_usuario: string, codigo: string): Promise<{
        success: boolean;
        user: any;
    }>;
    generateToken(user: any): string;
    private _safeUser;
}
