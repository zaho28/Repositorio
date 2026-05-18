import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, res: Response): Promise<{
        needs_code: boolean;
        user: any;
        success?: undefined;
        token?: undefined;
    } | {
        success: boolean;
        user: any;
        token: string;
        needs_code?: undefined;
    }>;
    verifyCode(dto: VerifyCodeDto, res: Response): Promise<{
        success: boolean;
        user: any;
        token: string;
    }>;
    logout(res: Response): {
        success: boolean;
    };
}
