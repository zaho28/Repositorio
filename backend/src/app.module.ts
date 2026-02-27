import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsuariosModule, ProductosModule, CategoriasModule, MovimientosModule, PedidosModule, NotificacionesModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
