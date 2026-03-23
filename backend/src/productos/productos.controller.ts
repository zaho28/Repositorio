import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // POST /productos
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateProductoDto) {
    console.log('controller - crear producto:', JSON.stringify(dto));
    return this.productosService.create(dto);
  }
  /*
  @Get('new')
  @HttpCode(201)
  somethingNew() {
    return {
      message: '201 Something New',
      status: 'Created'
    };
  }
  */

  // GET /productos
  @Get()
  findAll(@Query() query : any ) {
      console.log('controller - todos los productos:', JSON.stringify(query));
    return this.productosService.findAll(query);
  }

  // GET /productos/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('controller - encontrar producto:', id);
    return this.productosService.findOne(+id);
  }

  // GET /productos/check/:id
  @Get('check/:id')
  @HttpCode(200)
  checkProducto(@Param('id') id: string) {
    console.log('controller - check producto:', id);
    return this.productosService.checkProducto(+id);
  }

  // PATCH /productos/:id
  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    console.log('controller - actualizar producto:', id);
    return this.productosService.update(+id, dto); 
  }

  // DELETE /productos/:id
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    console.log('controller - eliminar producto:', id);
    return this.productosService.remove(+id);
  }
}