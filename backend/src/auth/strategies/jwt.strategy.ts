import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
        // extrae el token del header Authorization: Bearer <token>
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false, // rechaza tokens expirados
        secretOrKey: process.env.JWT_SECRET!|| 'clave_secreta_guruma',
        });
    }

    async validate(payload: any) {
        // busca el usuario en la BD usando el id que viene dentro del token
        const user = await this.prisma.usuario.findUnique({
        where: { id_usuario: payload.sub },
        });

        // si no existe lanza error 401
        if (!user) throw new UnauthorizedException();

        return user; // esto se guarda en request.user
    }
}