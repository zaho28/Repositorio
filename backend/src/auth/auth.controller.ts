import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('auth') 
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    login(@Body() dto: LoginDto) {
        console.log('controller - login:', JSON.stringify(dto));
        return this.authService.login(dto.correo, dto.contrasena);
    }

    @Public()
    @Post('verify-code')
    verifyCode(@Body() dto: VerifyCodeDto) {
        console.log('controller - verify-code:', JSON.stringify(dto));
        return this.authService.verifyCode(dto.id_usuario, dto.codigo);
    }
}