import { Controller, Get, Post, Query, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpCode,  NotFoundException, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException, InternalServerErrorException, HttpStatus} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express'; // interceptor de archivos
import { diskStorage } from 'multer'; // almacenamiento en disco de Multer
import { extname } from 'path'; // para obtener la extensión del archivo
//import { EnableCors } from '../auth/decorators/cors.decorator'; 

@ApiBearerAuth('JWT') 
@ApiSecurity('x-api-key')
@Controller('usuarios')
//@EnableCors()


export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en el correo, campos requeridos vacíos).' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado.' })
  @ApiResponse({ status: 500, description: 'Error interno al guardar en la base de datos.' })

  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    console.log('controller - crear usuario:', JSON.stringify(createUsuarioDto));
    try {
      return await this.usuariosService.create(createUsuarioDto);
    } catch (error : any) {
      if (error.code === '23505' || error.code === 11000) {
        throw new ConflictException('El correo ya está registrado');
      }
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al crear el usuario');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios retornada.' })
  @ApiResponse({ status: 400, description: 'Parámetros de query inválidos.' })
  @ApiResponse({ status: 401, description: 'Token JWT ausente o expirado.' })
  @ApiResponse({ status: 403, description: 'Sin permisos para listar usuarios.' })

  async findAll(@Query() query: any) {
    console.log('controller - todos los usuarios:', JSON.stringify(query));
    try {
      return await this.usuariosService.findAll(query);
    } catch (error: any) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al obtener los usuarios');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 400, description: 'ID con formato inválido.' })
  @ApiResponse({ status: 401, description: 'Token JWT ausente o expirado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })

  async findOne(@Param('id') id: string) {
    console.log('controller - detalle de usuario:', JSON.stringify({ id }));
    if (!id || id.trim() === '') {
      throw new BadRequestException('El ID del usuario es inválido');
    }
    const usuario = await this.usuariosService.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en la actualización.' })
  @ApiResponse({ status: 401, description: 'Token JWT ausente o expirado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 409, description: 'El correo ya está en uso por otro usuario.' })

  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    console.log('controller - actualizar usuario:', { id, updateUsuarioDto });
    try {
      const usuario = await this.usuariosService.update(id, updateUsuarioDto);
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      return usuario;
    } catch (error : any) {
      if (error.code === '23505' || error.code === 11000) {
        throw new ConflictException('El correo ya está en uso por otro usuario');
      }
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al actualizar el usuario');
    }
  }

  @Public()
  @Patch(':id/cambiar-contrasena')
  @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Nueva contraseña no cumple los requisitos mínimos.' })
  @ApiResponse({ status: 401, description: 'Contraseña actual incorrecta.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })

  async cambiarContrasena(
    @Param('id') id: string,
    @Body() body: { contrasenaActual: string; nuevaContrasena: string },
  ) {
    console.log('controller - cambiar contraseña:', id);

    if (!body.contrasenaActual || !body.nuevaContrasena) {
      throw new BadRequestException('La contraseña actual y la nueva contraseña son requeridas');
    }

    if (body.nuevaContrasena.length < 8) {
      throw new BadRequestException('La nueva contraseña debe tener mínimo 8 caracteres');
    }

    try {
      return await this.usuariosService.cambiarContrasena(
        id,
        body.contrasenaActual,
        body.nuevaContrasena,
      );
    } catch (error : any) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al cambiar la contraseña');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente.' })
  @ApiResponse({ status: 401, description: 'Token JWT ausente o expirado.' })
  @ApiResponse({ status: 403, description: 'Sin permisos para eliminar usuarios.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async remove(@Param('id') id: string) {
    console.log('controller - eliminar usuario:', JSON.stringify({ id }));
    try {
      const resultado = await this.usuariosService.remove(id);
      if (!resultado) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      return resultado;
    } catch (error : any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al eliminar el usuario');
    }
  }

  @Public()
  @Post(':id/imagen')
  @ApiOperation({ summary: 'Subir imagen de perfil' })
  @ApiResponse({ status: 200, description: 'Imagen subida y guardada correctamente.' })
  @ApiResponse({ status: 400, description: 'Archivo no enviado o tipo no permitido (solo jpg, jpeg, png, webp).' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 413, description: 'La imagen supera el límite de 5 MB.' })
  @ApiResponse({ status: 500, description: 'Error al guardar el archivo en disco.' })
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, cb) => {
          const nombreUnico = `${req.params.id}-${Date.now()}${extname(file.originalname)}`;
          cb(null, nombreUnico);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          cb(new BadRequestException('Solo se permiten imágenes en formato jpg, jpeg, png o webp'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
    }),
  )
  async subirImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('controller - subir imagen:', { id, file: file?.filename });

    if (!file) {
      throw new BadRequestException(
        'No se envió ningún archivo o el tipo no es permitido. Solo se aceptan jpg, jpeg, png y webp',
      );
    }
 
    try {
      const usuario = await this.usuariosService.findOne(id);
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      return await this.usuariosService.actualizarImagen(id, file);
    } catch (error : any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al guardar la imagen en disco');
    }
  }

  // POST /usuarios/solicitar-reset
  @Public()
  @Post('solicitar-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar código de reset de contraseña' })
  @ApiResponse({ status: 200, description: 'Si el correo existe, se enviará un código de recuperación.' })
  @ApiResponse({ status: 400, description: 'Correo incorrecto o ausente.' })
  @ApiResponse({ status: 500, description: 'Error al enviar el correo.' })
  async solicitarReset(@Body() body: { correo: string }) {
    if (!body.correo || !body.correo.includes('@')) {
      throw new BadRequestException('El correo electrónico es inválido o está ausente');
    }
    try {
      await this.usuariosService.solicitarReset(body.correo);
      // Siempre responde 200 para no revelar si el correo existe (evita enumeración)
      return { message: 'Si el correo está registrado, recibirás un código de recuperación' };
    } catch (error : any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al procesar la solicitud de reset');
    }
  }

  // POST /usuarios/reset-contrasena
  @Public()
  @Post('reset-contrasena')
  @ApiOperation({ summary: 'Restablecer contraseña con código' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente.' })
  @ApiResponse({ status: 400, description: 'Código inválido, expirado o nueva contraseña débil.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado con ese correo.' })
  async resetContrasena(
    @Body() body: { correo: string; codigo: string; nuevaContrasena: string },
  ) {
    if (!body.correo || !body.codigo || !body.nuevaContrasena) {
      throw new BadRequestException('El correo, el código y la nueva contraseña son requeridos');
    }
 
    if (body.nuevaContrasena.length < 8) {
      throw new BadRequestException('La nueva contraseña debe tener mínimo 8 caracteres');
    }
 
    try {
      return await this.usuariosService.resetContrasena(
        body.correo,
        body.codigo,
        body.nuevaContrasena,
      );
    } catch (error : any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al restablecer la contraseña');
    }
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Activar o desactivar usuario' })
  @ApiResponse({ status: 200, description: 'Estado del usuario cambiado (activo/inactivo).' })
  @ApiResponse({ status: 401, description: 'Token JWT ausente o expirado.' })
  @ApiResponse({ status: 403, description: 'Sin permisos para cambiar el estado del usuario.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async toggleEstado(@Param('id') id: string) {
    try {
      const usuario = await this.usuariosService.toggleEstado(id);
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      return usuario;
    } catch (error : any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al cambiar el estado del usuario');
    }
  }
}