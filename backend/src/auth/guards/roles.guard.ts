//verifica si el usuario tiene los roles necesarios para acceder a una ruta

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Roles } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // obtiene los roles requeridos por la ruta
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);

        // si la ruta no requiere roles deja pasar
        if (!requiredRoles) return true;

        // verifica si el usuario tiene alguno de los roles requeridos
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.roles?.includes(role));
    }
}