import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // POST /productos
  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  // GET /productos
  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  // GET /productos/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  // GET /productos/check/:id
  @Get('check/:id')
  checkProducto(@Param('id') id: string) {
    return this.productosService.checkProducto(+id);
  }

  // PATCH /productos/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.productosService.update(+id, dto);
  }

  // DELETE /productos/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}