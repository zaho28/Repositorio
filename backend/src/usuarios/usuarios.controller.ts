import { Controller, Get, Post, Query, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express'; // interceptor de archivos
import { diskStorage } from 'multer'; // almacenamiento en disco de Multer
import { extname } from 'path'; // para obtener la extensión del archivo
import { mkdirSync } from 'fs'; // para crear directorios si no existen

@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Public()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    console.log('controller - crear usuario:', JSON.stringify(createUsuarioDto));
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll(@Query() query: any) {
    console.log('controller - todos los usuarios:', JSON.stringify(query));
    return this.usuariosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('controller - detalle de usuario:', JSON.stringify({ id }));
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    console.log('controller - actualizar usuario:', { id, updateUsuarioDto });
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch(':id/cambiar-contrasena')
  cambiarContrasena(@Param('id') id: string,
  @Body() body: { contrasenaActual: string; nuevaContrasena: string }) {
  console.log('controller - cambiar contraseña:', id);
  return this.usuariosService.cambiarContrasena(id, body.contrasenaActual, body.nuevaContrasena);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('controller - eliminar usuario:', JSON.stringify({ id }));
    return this.usuariosService.remove(id);
  }

  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './uploads/perfiles', // carpeta donde guarda rutas img
      filename: (req, file, cb) => {
        const nombreUnico = `${req.params.id}-${Date.now()}${extname(file.originalname)}`;
        cb(null, nombreUnico);
      },
    }),
    fileFilter: (req, file, cb) => {
      // solo imágenes
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        cb(new Error('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  }))
  async subirImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('controller - subir imagen:', { id, file: file?.filename });
    return this.usuariosService.actualizarImagen(id, file);
  }
}
