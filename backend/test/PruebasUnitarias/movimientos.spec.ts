//RF-009.1 / RF-009.2
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MovimientosService } from '../../src/movimientos/movimientos.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { fakeMovimiento, fakeProducto } from '../utils/mock-factories';

describe('MovimientosService', () => {
  let service: MovimientosService;
  let prisma: any;

  const mockTx = {
    producto: { findUnique: jest.fn(), update: jest.fn() },
    movimiento: { create: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    prisma = {
      $queryRaw: jest.fn(),
      $queryRawUnsafe: jest.fn(),
      $transaction: jest.fn((callback) => callback(mockTx)),
      movimiento: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovimientosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(MovimientosService);
  });

  // RF-009.1 - Consultar historial de movimientos
  describe('findAll (CP-001)', () => {
    it('CP-001: debe consultar el historial completo de entradas y salidas con la info relacionada', async () => {
      const filasFake = [fakeMovimiento({ id_movimiento: 1, Cantidad_m: 5 })];
      prisma.$queryRaw.mockResolvedValue(filasFake);

      const resultado = await service.findAll({});

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(filasFake);
    });

    it('CP-003: debe devolver una lista vacía cuando no existen movimientos registrados', async () => {
      prisma.$queryRaw.mockResolvedValue([]);

      const resultado = await service.findAll({});

      expect(resultado).toEqual([]);
    });
  });

  describe('findByTipo', () => {
    it('debe filtrar los movimientos de tipo entrada (M_E)', async () => {
      prisma.movimiento.findMany.mockResolvedValue([{ id_movimiento: 1, id_m: 'M_E' }]);

      const resultado = await service.findByTipo('M_E');

      expect(prisma.movimiento.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id_m: 'M_E' } }),
      );
      expect(resultado).toHaveLength(1);
    });

    it('debe filtrar los movimientos de tipo salida (M_S)', async () => {
      prisma.movimiento.findMany.mockResolvedValue([{ id_movimiento: 2, id_m: 'M_S' }]);

      const resultado = await service.findByTipo('M_S');

      expect(prisma.movimiento.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id_m: 'M_S' } }),
      );
      expect(resultado).toHaveLength(1);
    });
  });

  // Registrar movimiento y actuaolizar  stock 
  describe('create', () => {
    it('debe registrar una entrada (M-E) y sumar la cantidad al stock del producto', async () => {
      mockTx.producto.findUnique.mockResolvedValue(
        fakeProducto({ id_producto: 1, stock_actual: 10 }),
      );
      mockTx.movimiento.create.mockResolvedValue({ id_movimiento: 99 });
      mockTx.producto.update.mockResolvedValue({ stock_actual: 15 });

      const dto = { Cantidad_m: 5, id_m: 'M-E', id_producto: 1, id_usuario: '123' };
      const resultado = await service.create(dto as any);

      expect(mockTx.producto.update).toHaveBeenCalledWith({
        where: { id_producto: 1 },
        data: expect.objectContaining({ stock_actual: { increment: 5 } }),
      });
      expect(resultado.stock_actual).toBe(15);
    });

    it('debe registrar una salida (M-S) y restar la cantidad del stock del producto', async () => {
      mockTx.producto.findUnique.mockResolvedValue(
        fakeProducto({ id_producto: 1, stock_actual: 10 }),
      );
      mockTx.movimiento.create.mockResolvedValue({ id_movimiento: 100 });
      mockTx.producto.update.mockResolvedValue({ stock_actual: 7 });

      const dto = { Cantidad_m: 3, id_m: 'M-S', id_producto: 1, id_usuario: '123' };
      const resultado = await service.create(dto as any);

      expect(mockTx.producto.update).toHaveBeenCalledWith({
        where: { id_producto: 1 },
        data: expect.objectContaining({ stock_actual: { increment: -3 } }),
      });
      expect(resultado.stock_actual).toBe(7);
    });

    it('debe rechazar el movimiento si el producto no existe (y no crear el movimiento)', async () => {
      mockTx.producto.findUnique.mockResolvedValue(null);

      const dto = { Cantidad_m: 1, id_m: 'M-E', id_producto: 999, id_usuario: '123' };

      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
      expect(mockTx.movimiento.create).not.toHaveBeenCalled();
      expect(mockTx.producto.update).not.toHaveBeenCalled();
    });

    it('debe rechazar una salida que dejaría el stock del producto en negativo', async () => {
      mockTx.producto.findUnique.mockResolvedValue(
        fakeProducto({ id_producto: 1, stock_actual: 2 }),
      );

      const dto = { Cantidad_m: 5, id_m: 'M-S', id_producto: 1, id_usuario: '123' };

      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
      expect(mockTx.movimiento.create).not.toHaveBeenCalled();
      expect(mockTx.producto.update).not.toHaveBeenCalled();
    });
  });

  describe('update / remove', () => {
    it('debe actualizar la cantidad y observaciones de un movimiento existente', async () => {
      prisma.movimiento.update.mockResolvedValue({ id_movimiento: 1, Cantidad_m: 8 });

      await service.update(1, { Cantidad_m: 8, observaciones: 'Ajuste manual' } as any);

      expect(prisma.movimiento.update).toHaveBeenCalledWith({
        where: { id_movimiento: 1 },
        data: { Cantidad_m: 8, observaciones: 'Ajuste manual' },
      });
    });

    it('debe eliminar un movimiento por su id', async () => {
      prisma.movimiento.delete.mockResolvedValue({ id_movimiento: 5 });

      await service.remove(5);

      expect(prisma.movimiento.delete).toHaveBeenCalledWith({ where: { id_movimiento: 5 } });
    });
  });

  // RF-009.2 - Generar reporte general
  describe('resumenGeneral / porDia (CP-004, CP-007)', () => {
    it('CP-004: debe generar el reporte con las estadísticas correctas del periodo', async () => {
      prisma.$queryRawUnsafe.mockResolvedValue([{ totalEntradas: 50, totalSalidas: 20 }]);

      const resultado = await service.resumenGeneral('2026-07-01', '2026-07-31');

      expect(resultado).toEqual({ totalEntradas: 50, totalSalidas: 20 });
    });

    it('CP-007: en un rango sin movimientos, SUM() sin filas devuelve NULL (no 0 como espera el CP)', async () => {
      prisma.$queryRawUnsafe.mockResolvedValue([{ totalEntradas: null, totalSalidas: null }]);

      const resultado = await service.resumenGeneral('2020-01-01', '2020-01-02');

      expect(resultado).toEqual({ totalEntradas: null, totalSalidas: null });
    });

    it('debe devolver un arreglo vacío en porDia() cuando no hay movimientos en el rango', async () => {
      prisma.$queryRawUnsafe.mockResolvedValue([]);

      const resultado = await service.porDia('2020-01-01', '2020-01-02');

      expect(resultado).toEqual([]);
    });
  });
});