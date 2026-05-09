import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.headers['x-api-key']; // ← cambia authorization por x-api-key

        console.log('MIDDLEWARE - x-api-key recibido:', apiKey);
        console.log('MIDDLEWARE - API_KEY esperado:', process.env.API_KEY);

        if (!apiKey) {
            throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
        }

        if (apiKey !== process.env.API_KEY) {
            throw new HttpException('Acceso denegado', HttpStatus.FORBIDDEN);
        }

        next();
    }
} 