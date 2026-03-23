import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------
  // OBTENER TODOS LOS PRODUCTOS ACTIVOS
  // --------------------------------------------------------
  async findAll(query :any) {
    console.log('Funcion que controla la creacion de productos')
    return this.prisma.producto.findMany({
      where: { estado: true },
      include: {
        categoria: { select: { nombre_c: true } },
        clasificacion: { select: { nombre_clas: true } },
      },
    });
  }

  // --------------------------------------------------------
  // OBTENER UN PRODUCTO POR ID
  // --------------------------------------------------------
  async findOne(id: number) {
    console.log('service - detalle de producto:', JSON.stringify({ id }));
    const producto = await this.prisma.producto.findFirst({
      where: { id_producto: id, estado: true },
      include: {
        categoria: { select: { nombre_c: true } },
        clasificacion: { select: { nombre_clas: true } },
      },
    });

    if (!producto) throw new NotFoundException(`Producto ${id} no encontrado`);
    return producto;
  }

  // --------------------------------------------------------
  // CREAR PRODUCTO
  // --------------------------------------------------------
  async create(dto: CreateProductoDto) {
    console.log('service - crear producto:', JSON.stringify(dto));
    return this.prisma.producto.create({
      data: {
        nom_producto: dto.nom_producto,
        precio_unitario: dto.precio_unitario,
        stock_actual: dto.stock_actual,
        stock_minimo: dto.stock_minimo,
        ultima_actualiz: new Date(),
        color: dto.color ?? null,
        talla: dto.talla ?? null,
        tama_o: dto.tamaño ?? null,
        descripcion: dto.descripcion,
        id_categoria: dto.id_categoria,
        id_clasificacion: dto.id_clasificacion ?? 1,
        ruta_imagen: dto.ruta_imagen ?? null,
        estado: dto.estado ?? true,
      },
    });
  }

  // --------------------------------------------------------
  // ACTUALIZAR PRODUCTO
  // --------------------------------------------------------
  async update(id: number, dto: UpdateProductoDto) {
    console.log('service - actualizar producto:', { id, dto });
    
    // si no existe lanza 404 automáticamente
    await this.findOne(id);

    const data: any = { ...dto };

    if (dto.tamaño !== undefined) {
      data.tama_o = dto.tamaño;
      delete data.tamaño;
    }

    data.ultima_actualiz = new Date();

    const actualizado = await this.prisma.producto.update({
      where: { id_producto: id },
      data,
    });

    // respuesta con mensaje
    return {
      statusCode: 200,
      message: `Producto ${id} actualizado exitosamente`,
      data: actualizado
    };
  }

  // --------------------------------------------------------
  // ELIMINAR (estado = false)
  // --------------------------------------------------------
  async remove(id: number) {
    console.log('service - eliminar producto:', JSON.stringify({ id }));
    await this.findOne(id);

    await this.prisma.producto.update({
      where: { id_producto: id },
      data: {
        estado: false,
        ultima_actualiz: new Date(),
      },
    });

    return { 
      statusCode: 200,
      message: `Producto ${id} eliminado exitosamente`
    };
  }

  // --------------------------------------------------------
  // VERIFICAR SI UN PRODUCTO EXISTE Y TIENE STOCK
  // --------------------------------------------------------
  async checkProducto(id: number) {
    console.log('service - check producto:', JSON.stringify({ id }));
    const producto = await this.prisma.producto.findFirst({
      where: { id_producto: id, estado: true },
      select: { id_producto: true, nom_producto: true, stock_actual: true },
    });

    if (!producto) return { found: false, message: 'Producto no encontrado' };
    return { found: true, product: producto };
  }
}