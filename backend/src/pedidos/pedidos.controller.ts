import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // POST /pedidos/crear
  @Post('crear')
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  // GET /pedidos - todos (admin)
  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  // GET /pedidos/usuario/:id_usuario
  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.pedidosService.findByUsuario(id_usuario);
  }

  // GET /pedidos/detalle/:id_pedido
  @Get('detalle/:id_pedido')
  findOne(@Param('id_pedido', ParseIntPipe) id_pedido: number) {
    return this.pedidosService.findOne(id_pedido);
  }

  // PATCH /pedidos/:id_pedido
  @Patch(':id_pedido')
  update(
    @Param('id_pedido', ParseIntPipe) id_pedido: number,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id_pedido, updatePedidoDto);
  }

  // DELETE /pedidos/:id_pedido
  @Delete(':id_pedido')
  remove(@Param('id_pedido', ParseIntPipe) id_pedido: number) {
    return this.pedidosService.remove(id_pedido);
  }
}