import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
    export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // LOGIN 
    async login(correo: string, contrasena: string) {
        // buscar usuario por correo
        const user = await this.prisma.usuario.findFirst({
        where: { correo },
        });

        // si no existe o la contraseña es incorrecta
        if (!user || !user.contrasena) throw new UnauthorizedException('Credenciales inválidas');

        const passwordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!passwordValid) throw new UnauthorizedException('Credenciales inválidas');

        // si es admin o trabajador necesita código
        if (user.id_rol_usuario === '1' || user.id_rol_usuario === '3') {
        return { needs_code: true, user };
        }

        // si es cliente genera token directo
        return {
        success: true,
        token: this._generateToken(user),
        user,
        };
    }

    // VERIFICAR CÓDIGO (admin y trabajador)
    async verifyCode(id_usuario: string, codigo: string) {
        const user = await this.prisma.usuario.findUnique({
        where: { id_usuario },
        });

        if (!user || !user.codigo) throw new UnauthorizedException('Usuario no encontrado');

        const codeValid = await bcrypt.compare(codigo, user.codigo);
        if (!codeValid) throw new UnauthorizedException('Código incorrecto');

        return {
        success: true,
        token: this._generateToken(user),
        user,
        };
    }

    // GENERAR TOKEN JWT
    private _generateToken(user: any) {
        const payload = {
        sub: user.id_usuario,   // cédula del usuario
        rol: user.id_rol_usuario, // rol del usuario
        };
        return this.jwtService.sign(payload);
    }
}