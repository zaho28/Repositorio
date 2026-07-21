//RF-009.3
import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionesService } from '../../src/notificaciones/notificaciones.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { fakeProductoAlertaRaw, fakePedidoRaw, fakeUsuario } from '../utils/mock-factories';

describe('NotificacionesService', () => {
  let service: NotificacionesService;
  let prisma: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    prisma = {
      $queryRaw: jest.fn(),
      producto: {
        fields: { stock_minimo: 'stock_minimo' },
        findMany: jest.fn(),
        count: jest.fn(),
      },
      pedido: { findMany: jest.fn(), count: jest.fn() },
      usuario: { findMany: jest.fn() },
      ticket_compra: { findMany: jest.fn() },
      detalles_pedido: { findMany: jest.fn() },
      notificacion: {
        create: jest.fn(),
        createMany: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacionesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(NotificacionesService);
  });

  function mockStockBajoRaw(filas: any[]) {
    prisma.$queryRaw.mockResolvedValueOnce(filas);
  }

  // RF-009.3 - Consultar notificaciones (pedidos y stock bajo)
  describe('findAll (CP-008, CP-011)', () => {
    it('CP-008: debe desplegar en orden las alertas de stock bajo, agotados y nuevos pedidos', async () => {
      prisma.producto.findMany.mockResolvedValue([]);
      prisma.pedido.findMany.mockResolvedValue([fakePedidoRaw({ id_usuario: 'u1' })]);
      prisma.usuario.findMany.mockResolvedValue([fakeUsuario({ id_usuario: 'u1' })]);

      // _getStockBajo()
      mockStockBajoRaw([fakeProductoAlertaRaw({ stock_actual: 2 })]);
      // _getAgotados()
      mockStockBajoRaw([fakeProductoAlertaRaw({ stock_actual: 0 })]);

      const resultado = await service.findAll({});

      expect(resultado).toHaveLength(3);
      const tipos = resultado.map((n: any) => n.tipo);
      expect(tipos).toEqual(expect.arrayContaining(['stock-bajo', 'agotado', 'pedido']));
    });

    it('CP-011: debe devolver una bandeja vacía cuando no hay alertas pendientes', async () => {
      prisma.producto.findMany.mockResolvedValue([]);
      prisma.pedido.findMany.mockResolvedValue([]);
      prisma.usuario.findMany.mockResolvedValue([]);
      mockStockBajoRaw([]); // stock bajo
      mockStockBajoRaw([]); // agotados

      const resultado = await service.findAll({});

      expect(resultado).toEqual([]);
    });
  });

  describe('stockBajo (CP-009)', () => {
    it('CP-009: debe filtrar y mostrar únicamente las alertas de stock crítico', async () => {
      prisma.$queryRaw.mockResolvedValue([fakeProductoAlertaRaw({ stock_actual: 1 })]);

      const resultado = await service.stockBajo({});

      expect(resultado).toHaveLength(1);
      expect(resultado[0].tipo).toBe('stock-bajo');
    });
  });

  describe('ruta_destino de cada alerta (CP-010)', () => {
    it('CP-010: las alertas de stock/agotados deben apuntar a /movimientos', async () => {
      prisma.$queryRaw.mockResolvedValue([fakeProductoAlertaRaw({ stock_actual: 1 })]);

      const resultado = await service.stockBajo({});

      expect(resultado[0].ruta_destino).toBe('/movimientos');
    });

    it('CP-010: las alertas de pedido nuevo deben apuntar a /pedidos_realizados', async () => {
      prisma.producto.findMany.mockResolvedValue([]);
      prisma.pedido.findMany.mockResolvedValue([
        fakePedidoRaw({ id_pedido: 7, id_usuario: 'u1', id_tipo: 'P_P' }),
      ]);
      prisma.usuario.findMany.mockResolvedValue([fakeUsuario({ id_usuario: 'u1' })]);
      mockStockBajoRaw([]);
      mockStockBajoRaw([]);

      const resultado = await service.findAll({});
      const notifPedido = resultado.find((n: any) => n.tipo === 'pedido');

      expect(notifPedido).toBeDefined();
      expect(notifPedido?.ruta_destino).toBe('/pedidos_realizados');
    });
  });

  describe('count / estadisticas', () => {
    it('debe contar correctamente las alertas de stock bajo, agotados y pedidos nuevos', async () => {
      prisma.producto.count.mockResolvedValueOnce(3).mockResolvedValueOnce(1);
      prisma.pedido.count.mockResolvedValue(2);

      const resultado = await service.count({});

      expect(resultado).toEqual({
        alertas_stock_bajo: 3,
        alertas_agotados: 1,
        nuevos_pedidos: 2,
        total_notificaciones: 6,
      });
    });
  });

  describe('notificacion se mantiene en el panel de control', () => {
    it('debe crear una notificación individual para un usuario', async () => {
      prisma.notificacion.create.mockResolvedValue({ id_notificacion: 1 });

      await service.crearNotificacion('123', 'Título', 'Mensaje', 'pedido_nuevo');

      expect(prisma.notificacion.create).toHaveBeenCalledWith({
        data: { id_usuario: '123', titulo: 'Título', mensaje: 'Mensaje', tipo: 'pedido_nuevo' },
      });
    });

    it('debe crear la misma notificación para todos los admins/trabajadores activos', async () => {
      prisma.usuario.findMany.mockResolvedValue([
        { id_usuario: 'a1' },
        { id_usuario: 'a2' },
      ]);
      prisma.notificacion.createMany.mockResolvedValue({ count: 2 });

      await service.crearNotificacionAdmins('Stock bajo', 'Revisar inventario', 'stock_bajo');

      expect(prisma.notificacion.createMany).toHaveBeenCalledWith({
        data: [
          { id_usuario: 'a1', titulo: 'Stock bajo', mensaje: 'Revisar inventario', tipo: 'stock_bajo' },
          { id_usuario: 'a2', titulo: 'Stock bajo', mensaje: 'Revisar inventario', tipo: 'stock_bajo' },
        ],
      });
    });

    it('no debe llamar createMany si no hay admins/trabajadores activos', async () => {
      prisma.usuario.findMany.mockResolvedValue([]);

      await service.crearNotificacionAdmins('Título', 'Mensaje', 'stock_bajo');

      expect(prisma.notificacion.createMany).not.toHaveBeenCalled();
    });

    it('debe marcar una notificación como leída solo si pertenece al usuario', async () => {
      prisma.notificacion.updateMany.mockResolvedValue({ count: 1 });

      await service.marcarLeida(5, '123');

      expect(prisma.notificacion.updateMany).toHaveBeenCalledWith({
        where: { id_notificacion: 5, id_usuario: '123' },
        data: { leida: true },
      });
    });

    it('debe contar las notificaciones no leídas de un usuario', async () => {
      prisma.notificacion.count.mockResolvedValue(4);

      const resultado = await service.contarNoLeidas('123');

      expect(prisma.notificacion.count).toHaveBeenCalledWith({
        where: { id_usuario: '123', leida: false },
      });
      expect(resultado).toBe(4);
    });
  });
});