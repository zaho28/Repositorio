import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // GET /notificaciones
  @Get()
  findAll() {
    return this.notificacionesService.findAll();
  }

  // GET /notificaciones/count
  @Get('count')
  count() {
    return this.notificacionesService.count();
  }

  // GET /notificaciones/stock-bajo
  @Get('stock-bajo')
  stockBajo() {
    return this.notificacionesService.stockBajo();
  }

  // GET /notificaciones/agotados
  @Get('agotados')
  agotados() {
    return this.notificacionesService.agotados();
  }

  // GET /notificaciones/pedidos-recientes?dias=7
  @Get('pedidos-recientes')
  pedidosRecientes(
    @Query('dias', new DefaultValuePipe(7), ParseIntPipe) dias: number,
  ) {
    return this.notificacionesService.pedidosRecientes(dias);
  }

  // GET /notificaciones/estadisticas
  @Get('estadisticas')
  estadisticas() {
    return this.notificacionesService.estadisticas();
  }
}