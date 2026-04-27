import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  // GET /movimientos
  @Get()
  findAll(@Query() query: any) {
    return this.movimientosService.findAll(query);
  }

  // GET /movimientos/resumen-general?desde=&hasta=
  @Get('resumen-general')
  resumenGeneral(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.movimientosService.resumenGeneral(desde, hasta);
  }

  // GET /movimientos/por-dia?desde=&hasta=
  @Get('por-dia')
  porDia(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.movimientosService.porDia(desde, hasta);
  }

  // GET /movimientos/por-tipo?desde=&hasta=
  @Get('por-tipo')
  porTipo(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.movimientosService.porTipo(desde, hasta);
  }

  // GET /movimientos/top-productos?desde=&hasta=&limit=
  @Get('top-productos')
  topProductos(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('limit') limit?: string,
  ) {
    return this.movimientosService.topProductos(desde, hasta, limit ? parseInt(limit) : 10);
  }

  // GET /movimientos/resumen-mensual
  @Get('resumen-mensual')
  resumenMensual() {
    return this.movimientosService.resumenMensual();
  }

  // GET /movimientos/tipo/:tipo
  @Get('tipo/:tipo')
  findByTipo(@Param('tipo') tipo: string) {
    return this.movimientosService.findByTipo(tipo);
  }

  // GET /movimientos/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientosService.findOne(id);
  }

  // POST /movimientos
/*  @Post()
  create(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.movimientosService.create(createMovimientoDto);
  }*/
  @Post() 
  async create(@Body() createMovimientoDto: CreateMovimientoDto) {
  console.log('RAW BODY:', JSON.stringify(createMovimientoDto));  // 👈
  console.log('Cantidad_m:', createMovimientoDto.Cantidad_m);
  console.log('id_m:', createMovimientoDto.id_m);
  return this.movimientosService.create(createMovimientoDto);
}

  // PATCH /movimientos/:id
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMovimientoDto: UpdateMovimientoDto) {
    return this.movimientosService.update(id, updateMovimientoDto);
  }

  // DELETE /movimientos/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movimientosService.remove(id);
  }
}