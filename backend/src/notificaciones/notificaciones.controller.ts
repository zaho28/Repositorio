import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // GET /notificaciones
  @Get()
  findAll(@Query() query: any) {
    console.log('controller - todas las notificaciones:', JSON.stringify(query));
    return this.notificacionesService.findAll(query);
  }

  // GET /notificaciones/count
  @Get('count')
  count(@Query() query: any) {
    console.log('controller - contar notificaciones:', JSON.stringify(query));
    return this.notificacionesService.count(query);
  }

  // GET /notificaciones/stock-bajo
  @Get('stock-bajo')
  stockBajo(@Query() query: any) {
    console.log('controller - notificaciones de stock bajo:', JSON.stringify(query));
    return this.notificacionesService.stockBajo(query);
  }

  // GET /notificaciones/agotados
  @Get('agotados')
  agotados(@Query() query: any) {
    console.log('controller - notificaciones de productos agotados:', JSON.stringify(query));
    return this.notificacionesService.agotados(query);
  }

  // GET /notificaciones/pedidos-recientes?dias=7
  @Get('pedidos-recientes') 
  pedidosRecientes(@Query('dias', new DefaultValuePipe(7), ParseIntPipe) dias: number,) {
    console.log(`controller - notificaciones de pedidos recientes | días: ${dias}`);
    return this.notificacionesService.pedidosRecientes(dias);
  }

  // GET /notificaciones/estadisticas
  @Get('estadisticas')
  estadisticas(@Query() query: any) {
    console.log('controller - estadísticas:', JSON.stringify(query));
    return this.notificacionesService.estadisticas(query);
  }
}