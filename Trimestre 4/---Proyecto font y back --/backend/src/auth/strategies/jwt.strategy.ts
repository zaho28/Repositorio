import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import * as dotenv from 'dotenv';

dotenv.config();

    const cookieExtractor = (req: Request): string | null => {
    return req?.cookies?.access_token ?? null;
    };

@Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
        jwtFromRequest: cookieExtractor, // leer desde cookie
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET! || 'clave_secreta_guruma',
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.usuario.findUnique({
        where: { id_usuario: payload.sub },
        });
        if (!user) throw new UnauthorizedException();
        return user;
    }
}