import { Controller, Get } from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // GET /categorias
  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  // GET /categorias/clasificaciones
  @Get('clasificaciones')
  findAllClasificaciones() {
    return this.categoriasService.findAllClasificaciones();
  }
}