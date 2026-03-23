import { Controller, Get, Post, Query, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Post()
  create(@Body() createMovimientoDto: CreateMovimientoDto) {
    console.log('controller - crear movimiento:', JSON.stringify(createMovimientoDto));
    return this.movimientosService.create(createMovimientoDto);
  }

  @Get()
  findAll(@Query() query: any) {
    console.log('controller - todos los movimeintos: ', JSON.stringify(query));
    return this.movimientosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('controller - encontrar movimiento: ID', id);
    return this.movimientosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovimientoDto: UpdateMovimientoDto) {
    console.log('controller - actualizar movimiento: ID', id, { updateMovimientoDto });
    return this.movimientosService.update(+id, updateMovimientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('controller - eliminar movimiento: ID', id);
    return this.movimientosService.remove(+id);
  }
}
