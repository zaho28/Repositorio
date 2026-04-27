import { Controller, Get, Post, Body, Patch, Query, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles as RolesDecorator } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/enums/roles.enum';
 
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post('crear')
  @RolesDecorator(Roles.ADMIN, Roles.TRABAJADOR, Roles.USUARIO) 
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidosService.create(dto);
  }

  @Get()
  @RolesDecorator(Roles.ADMIN, Roles.TRABAJADOR)
  findAll(@Query() query: any) {
    return this.pedidosService.findAll(query);
  }

  @Get('usuario/:id_usuario')
  @RolesDecorator(Roles.ADMIN, Roles.TRABAJADOR, Roles.USUARIO)
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.pedidosService.findByUsuario(id_usuario);
  }

  @Get('detalle/:id_pedido')
  @RolesDecorator(Roles.ADMIN, Roles.TRABAJADOR, Roles.USUARIO)
  findOne(@Param('id_pedido', ParseIntPipe) id_pedido: number) {
    return this.pedidosService.findOne(id_pedido);
  }

  @Patch(':id_pedido')
  @RolesDecorator(Roles.ADMIN, Roles.TRABAJADOR, Roles.USUARIO)
  update(@Param('id_pedido', ParseIntPipe) id_pedido: number, @Body() dto: UpdatePedidoDto) {
    return this.pedidosService.update(id_pedido, dto);
  }

  @Delete(':id_pedido')
  @RolesDecorator(Roles.ADMIN)
  remove(@Param('id_pedido', ParseIntPipe) id_pedido: number) {
    return this.pedidosService.remove(id_pedido);
  }
}