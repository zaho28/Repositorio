import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PedidosPersonalizadosService } from './pedidos-personalizados.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('pedidos-personalizados')
export class PedidosPersonalizadosController {
  constructor(private readonly service: PedidosPersonalizadosService) {}

  // GET /pedidos-personalizados/materiales
  @Public()
  @Get('materiales')
  getMateriales(@Query() query: any) {
    console.log('controller - todos los materiales disponibles:', JSON.stringify(query));
    return this.service.getMateriales(query);
  }

  // GET /pedidos-personalizados/materiales/:tipo
  @Public()
  @Get('materiales/:tipo')
  getMaterialesPorTipo(@Param('tipo') tipo: string) {
    console.log('controller - obtener materiales por tipo:', JSON.stringify(tipo));
    return this.service.getMaterialesPorTipo(tipo);
  }

  // POST /pedidos-personalizados
  @Post()
  crearPedido(@Body() dto: {
    id_usuario: string;
    tipo_producto: string;
    tamanio: string;
    metodo_pago: string;
    materiales: { id_material: number; cantidad: number }[];
  }) {
    console.log('controller - crear pedido personalizado:', JSON.stringify(dto));
    return this.service.crearPedido(dto);
  }

  // GET /pedidos-personalizados (admin y trabajador)
  @Roles('1' as any, '3' as any)
  @Get()
  findAll(@Query() query: any) {
    console.log('controller - obtener pedidos personalizados (admin/trabajador):', JSON.stringify(query));
    return this.service.findAll(query);
  }

  // GET /pedidos-personalizados/usuario/:id
  @Get('usuario/:id')
  findByUsuario(@Param('id') id: string) {
    console.log('controller - obtener pedidos de un usuario:', JSON.stringify(id));
    return this.service.findByUsuario(id);
  }
}