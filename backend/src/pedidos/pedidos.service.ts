import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  // -------------------------------------------------------
  // CREAR PEDIDO COMPLETO CON TICKET (transacción)
  // -------------------------------------------------------
  async create(dto: CreatePedidoDto) {
    const { items, id_usuario, metodo_pago, subtotal, total } = dto;

    if (!items || items.length === 0 || !id_usuario || !metodo_pago) {
      throw new BadRequestException('Faltan datos obligatorios (items, id_usuario, metodo_pago)');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Crear el pedido
      const pedido = await tx.pedido.create({
        data: {
          fecha: new Date(),
          estado: 'Pendiente',
          id_usuario,
          id_tipo: 'P_E',
        },
      });

      const resultados: { producto: string; cantidad: number; stock_restante: number }[] = [];

      // 2. Procesar cada producto
      for (const item of items) {
        const { id_producto, cantidad, precio } = item;

        const producto = await tx.producto.findFirst({
          where: { id_producto, estado: true },
        });

        if (!producto) {
          throw new NotFoundException(`Producto ${id_producto} no encontrado`);
        }

        if (producto.stock_actual < cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nom_producto}. Disponible: ${producto.stock_actual}, Solicitado: ${cantidad}`,
          );
        }

        await tx.producto.update({
          where: { id_producto },
          data: {
            stock_actual: { decrement: cantidad },
            ultima_actualiz: new Date(),
          },
        });

        await tx.detalles_pedido.create({
          data: {
            descrip_detalles: `${producto.nom_producto} - $${precio}`,
            cantidad,
            id_pedido: pedido.id_pedido,
            id_producto,
          },
        });

        await tx.movimiento.create({
          data: {
            Cantidad_m: cantidad,
            fecha_m: new Date(),
            observaciones: `Venta Online - Pedido #${pedido.id_pedido}`,
            id_m: 'M_S',
            id_producto,
            id_usuario,
          },
        });

        resultados.push({
          producto: producto.nom_producto,
          cantidad,
          stock_restante: producto.stock_actual - cantidad,
        });
      }

      // 3. Crear el ticket de compra
      const num_ticket = Math.floor(100000 + Math.random() * 900000);

      const ticket = await tx.ticket_compra.create({
        data: {
          num_ticket,
          fecha_emision: new Date(),
          sub_total: subtotal,
          total_ticket: total,
          id_pedido: pedido.id_pedido,
          id_estado: 'E_pd',
          id_met_pago: metodo_pago as any,
        },
      });

      return {
        success: true,
        message: 'Pedido creado con éxito',
        data: {
          id_pedido: pedido.id_pedido,
          num_ticket,
          id_ticket: ticket.id_ticket_c,
          productos_procesados: resultados.length,
          detalles: resultados,
        },
      };
    });
  }

  // -------------------------------------------------------
  // OBTENER PEDIDOS DE UN USUARIO
  // -------------------------------------------------------
  async findByUsuario(id_usuario: string) {
    return this.prisma.pedido.findMany({
      where: { id_usuario },
      orderBy: { fecha: 'desc' },
      include: {
        ticket_compra: {
          include: {
            estado_pago: true,
            metodo_pago: true,
          },
        },
        detalles_pedido: {
          include: {
            producto: {
              select: {
                nom_producto: true,
                precio_unitario: true,
                ruta_imagen: true,
              },
            },
          },
        },
      },
    });
  }

  // -------------------------------------------------------
  // OBTENER TODOS LOS PEDIDOS (ADMIN)
  // -------------------------------------------------------
  async findAll() {
    return this.prisma.pedido.findMany({
      orderBy: { fecha: 'desc' },
      include: {
        usuario: {
          select: {
            nom_1: true,
            ape_1: true,
            telefono: true,
            correo: true,
          },
        },
        ticket_compra: {
          include: {
            estado_pago: true,
            metodo_pago: true,
          },
        },
        detalles_pedido: true,
      },
    });
  }

  // -------------------------------------------------------
  // DETALLE COMPLETO DE UN PEDIDO
  // -------------------------------------------------------
  async findOne(id_pedido: number) {
    const pedido = await this.prisma.pedido.findFirst({
      where: { id_pedido },
      include: {
        usuario: {
          select: {
            nom_1: true,
            ape_1: true,
            correo: true,
            telefono: true,
          },
        },
        ticket_compra: {
          include: {
            estado_pago: true,
            metodo_pago: true,
          },
        },
        detalles_pedido: {
          include: {
            producto: {
              select: {
                nom_producto: true,
                precio_unitario: true,
                ruta_imagen: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido ${id_pedido} no encontrado`);
    }

    return pedido;
  }

  // -------------------------------------------------------
  // ACTUALIZAR ESTADO DE UN PEDIDO
  // -------------------------------------------------------
  async update(id_pedido: number, dto: UpdatePedidoDto) {
    await this.findOne(id_pedido);

    return this.prisma.pedido.update({
      where: { id_pedido },
      data: { estado: dto.estado },
    });
  }

  // -------------------------------------------------------
  // ELIMINAR PEDIDO
  // -------------------------------------------------------
  async remove(id_pedido: number) {
    await this.findOne(id_pedido);

    return this.prisma.pedido.delete({
      where: { id_pedido },
    });
  }
}