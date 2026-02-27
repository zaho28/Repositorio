import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST /auth/login
    @Post('login')
    login(@Body() body: { correo: string; contrasena: string }) {
        return this.authService.login(body.correo, body.contrasena);
    }

    // POST /auth/verify-code
    @Post('verify-code')
    verifyCode(@Body() body: { id_usuario: string; codigo: string }) {
        return this.authService.verifyCode(body.id_usuario, body.codigo);
    }
}