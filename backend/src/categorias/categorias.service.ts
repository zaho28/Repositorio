import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  // GET todas las categorías
  findAll() {
    return this.prisma.categoria.findMany({
      select: {
        id_categoria: true,
        nombre_c: true,
      },
    });
  }

  // GET todas las clasificaciones
  findAllClasificaciones() {
    return this.prisma.clasificacion.findMany({
      select: {
        id_clasificacion: true,
        nombre_clas: true,
      },
    });
  }
}