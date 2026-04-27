import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';

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

  // GET /productos
  @Get()
  @Public()
  findAll(@Query() query: any) {
    console.log('controller - todos los productos:', JSON.stringify(query));
    return this.productosService.findAll(query);
  }

  // GET /productos/check/:id 
  @Get('check/:id')
  @HttpCode(200) 
  checkProducto(@Param('id') id: string) {
    console.log('controller - check producto:', id);
    return this.productosService.checkProducto(+id);
  }

  // GET /productos/:id
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    console.log('controller - encontrar producto:', id);
    return this.productosService.findOne(+id);
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

  // POST /productos/:id/imagen
  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('imagen_producto', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dir = './uploads/productos';
        mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const nombreUnico = `${req.params.id}-${Date.now()}${extname(file.originalname)}`;
        cb(null, nombreUnico);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        cb(new Error('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async subirImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('controller - subir imagen producto:', { id, file: file?.filename });
    return this.productosService.actualizarImagen(+id, file);
  }
}