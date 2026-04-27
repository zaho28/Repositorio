import { Controller, Get, HttpCode, Query } from '@nestjs/common'; 
import { CategoriasService } from './categorias.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get() 
  findAll(@Query() query: any) { 
    console.log('controller - todas las categorias:', JSON.stringify(query)); 
    return this.categoriasService.findAll(query); 
  }

  // GET /categorias/clasificaciones
  @Get('clasificaciones')
  findAllClasificaciones(@Query() query: any) {
    console.log('controller - todas las clasificaciones:', JSON.stringify(query)); 
    return this.categoriasService.findAllClasificaciones(query);
  }

  // http status 404 si no se encuentra la categoria o clasificacion
  @Get('not-found')
  @HttpCode(404)
  notFound() {
    return '404 Categoría o clasificación no encontrada';
  }

}