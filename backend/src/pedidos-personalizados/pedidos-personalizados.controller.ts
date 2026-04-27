import { Controller, Get, Post, Patch, Body, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';import { PedidosPersonalizadosService } from './pedidos-personalizados.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';

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

  // POST /pedidos-personalizados/materiales
  @Post('materiales')
  crearMaterial(@Body() dto: {
      nombre: string;
      tipo: string;
      unidad: string;
      precio_unitario: number;
      stock_actual: number;
      stock_minimo: number;
  }) {
      console.log('controller - crear material:', JSON.stringify(dto));
      return this.service.crearMaterial(dto);
  }

  // PATCH /pedidos-personalizados/materiales/:id
  @Patch('materiales/:id')
  actualizarMaterial(
      @Param('id') id: string,
      @Body() dto: {
          nombre?: string;
          tipo?: string;
          unidad?: string;
          precio_unitario?: number;
          stock_actual?: number;
          stock_minimo?: number;
      }
  ) {
      console.log('controller - actualizar material:', id, JSON.stringify(dto));
      return this.service.actualizarMaterial(+id, dto);
  }

  // POST /pedidos-personalizados/materiales/:id/imagen
  @Post('materiales/:id/imagen')
  @UseInterceptors(FileInterceptor('imagen', {
      storage: diskStorage({
          destination: (req, file, cb) => {
              const carpeta = './uploads/materiales';
              mkdirSync(carpeta, { recursive: true });
              cb(null, carpeta);
          },
          filename: (req, file, cb) => {
              const nombre = `material-${req.params.id}-${Date.now()}${extname(file.originalname)}`;
              cb(null, nombre);
          },
      }),
      fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
              cb(new Error('Solo imágenes'), false);
          }
          cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
  }))
  subirImagenMaterial(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File
  ) {
      return this.service.actualizarImagenMaterial(+id, file);
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
  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    console.log('controller - obtener pedidos de un usuario:', JSON.stringify(id_usuario));
    return this.service.findByUsuario(id_usuario);
  }
}