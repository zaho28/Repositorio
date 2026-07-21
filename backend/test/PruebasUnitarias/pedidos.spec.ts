//RF-007.1 / RF-007.2 / RF-007.3 / RF-008.1 / RF-008.2 / RF-008.3 / RF-008.4
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PedidosService } from '../../src/pedidos/pedidos.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { FcmPushService } from '../../src/notificaciones/fcm-push.service';
import { fakePedidoDetalleCompleto } from '../utils/mock-factories';

describe('PedidosService', () => {
	let service: PedidosService;
	let prisma: any;
	let fcmPush: any;

	const mockTx = {
		pedido: { create: jest.fn() },
		producto: { findFirst: jest.fn(), update: jest.fn() },
		detalles_pedido: { create: jest.fn() },
		movimiento: { create: jest.fn() },
		ticket_compra: { create: jest.fn() },
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		prisma = {
		$transaction: jest.fn((callback) => callback(mockTx)),
		pedido: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
		ticket_compra: { updateMany: jest.fn() },
		};

		fcmPush = {
		notificarAdmins: jest.fn(),
		notificarUsuario: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
		providers: [
			PedidosService,
			{ provide: PrismaService, useValue: prisma },
			{ provide: FcmPushService, useValue: fcmPush },
		],
		}).compile();

		service = module.get(PedidosService);
	});

	function mockTransaccionExitosa(id_producto: number, stockDisponible: number) {
		mockTx.pedido.create.mockResolvedValue({ id_pedido: faker.number.int({ min: 1, max: 9999 }) });
		mockTx.producto.findFirst.mockResolvedValue({
		id_producto,
		nom_producto: faker.commerce.productName(),
		stock_actual: stockDisponible,
		});
		mockTx.producto.update.mockResolvedValue({});
		mockTx.detalles_pedido.create.mockResolvedValue({});
		mockTx.movimiento.create.mockResolvedValue({});
		mockTx.ticket_compra.create.mockResolvedValue({
		id_ticket_c: faker.number.int({ min: 1, max: 9999 }),
		});
	}

	// RF-007.1 - Registrar pedido
	it('CP-001: debe generar un ticket al confirmar un pedido estándar con stock suficiente', async () => {
		const id_producto = faker.number.int({ min: 1, max: 1000 });
		const cantidad = faker.number.int({ min: 1, max: 3 });
		const precio = faker.number.float({ min: 10000, max: 50000, fractionDigits: 2 });

		mockTransaccionExitosa(id_producto, cantidad + 10); // stock suficiente

		const dto = {
		id_usuario: faker.string.uuid(),
		metodo_pago: 'Efectivo',
		subtotal: precio * cantidad,
		total: precio * cantidad,
		items: [{ id_producto, cantidad, precio }],
		};

		const resultado = await service.create(dto as any);

		expect(resultado.success).toBe(true);
		expect(mockTx.ticket_compra.create).toHaveBeenCalledTimes(1);
		expect(resultado.data.num_ticket).toBeDefined();
		expect(typeof resultado.data.num_ticket).toBe('number');
		// el ticket recién generado debe iniciar en estado "Pendiente" (E_pd)
		expect(mockTx.ticket_compra.create).toHaveBeenCalledWith(
		expect.objectContaining({
			data: expect.objectContaining({ id_estado: 'E_pd' }),
		}),
		);
	});

	// RF-008.1
	it('CP-003 (RF-008.1): el ticket debe crearse con id_estado y método de pago "Pendiente" por defecto', async () => {
		const id_producto = faker.number.int({ min: 1, max: 1000 });
		mockTransaccionExitosa(id_producto, 10);

		const dto = {
		id_usuario: faker.string.uuid(),
		metodo_pago: 'Efectivo',
		subtotal: 10000,
		total: 10000,
		items: [{ id_producto, cantidad: 1, precio: 10000 }],
		};

		await service.create(dto as any);

		expect(mockTx.ticket_compra.create).toHaveBeenCalledWith(
		expect.objectContaining({
			data: expect.objectContaining({ id_estado: 'E_pd', id_met_pago: 'Mtd_PD' }),
		}),
		);
	});

	it('CP-004 (RF-008.1): num_ticket debe ser un número de 6 dígitos dentro del rango esperado', async () => {
		const id_producto = faker.number.int({ min: 1, max: 1000 });
		mockTransaccionExitosa(id_producto, 10);

		const dto = {
		id_usuario: faker.string.uuid(),
		metodo_pago: 'Efectivo',
		subtotal: 10000,
		total: 10000,
		items: [{ id_producto, cantidad: 1, precio: 10000 }],
		};

		const resultado = await service.create(dto as any);

		expect(resultado.data.num_ticket).toBeGreaterThanOrEqual(100000);
		expect(resultado.data.num_ticket).toBeLessThan(1000000);
	});
	it.todo('CP-004 (RF-008.1): garantizar que num_ticket sea único/secuencial — depende de una restricción en BD, no verificable a nivel de servicio con mocks');

	it('CP-002: debe rechazar el pedido si un producto no tiene stock suficiente y no debe generar ticket', async () => {
		const id_producto = faker.number.int({ min: 1, max: 1000 });
		const cantidadSolicitada = 5;
		const stockDisponible = 2; // menos de lo pedido

		mockTransaccionExitosa(id_producto, stockDisponible);

		const dto = {
		id_usuario: faker.string.uuid(),
		metodo_pago: 'Efectivo',
		subtotal: 10000,
		total: 10000,
		items: [{ id_producto, cantidad: cantidadSolicitada, precio: 10000 }],
		};

		await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
		expect(mockTx.ticket_compra.create).not.toHaveBeenCalled();
		expect(mockTx.producto.update).not.toHaveBeenCalled();
	});

	it('CP-003: no debe permitir confirmar un pedido con el carrito vacío', async () => {
		const dto = {
		id_usuario: faker.string.uuid(),
		metodo_pago: 'Efectivo',
		subtotal: 0,
		total: 0,
		items: [], // carrito vacío
		};

		await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
		expect(prisma.$transaction).not.toHaveBeenCalled();
	});

	it('debe rechazar el pedido si contiene el mismo producto duplicado', async () => {
		const id_producto = faker.number.int({ min: 1, max: 1000 });

		const dto = {
		id_usuario: faker.string.uuid(),
		metodo_pago: 'Efectivo',
		subtotal: 20000,
		total: 20000,
		items: [
			{ id_producto, cantidad: 1, precio: 10000 },
			{ id_producto, cantidad: 1, precio: 10000 }, // mismo id_producto otra vez
		],
		};

		await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
		expect(prisma.$transaction).not.toHaveBeenCalled();
	});

	it('debe rechazar el pedido si faltan datos obligatorios (metodo_pago)', async () => {
		const dto = {
		id_usuario: faker.string.uuid(),
		metodo_pago: '', // vacío
		subtotal: 10000,
		total: 10000,
		items: [{ id_producto: 1, cantidad: 1, precio: 10000 }],
		};

		await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
	});

	// RF-007.2 - Consultar/ver estado de pedido
	it('CP-005 (RF-007.2): el cliente recibe notificación push cuando cambia el estado de su pedido', async () => {
		const id_pedido = faker.number.int({ min: 1, max: 9999 });
		const id_usuario = faker.string.uuid();

		prisma.pedido.findFirst.mockResolvedValue(
		fakePedidoDetalleCompleto({ id_pedido, id_usuario, estado: 'Pendiente' }),
		);
		prisma.pedido.update.mockResolvedValue({ id_pedido, estado: 'Pagado' });

		await service.update(id_pedido, { estado: 'Pagado' } as any);

		expect(fcmPush.notificarUsuario).toHaveBeenCalledWith(
		id_usuario,
		'Actualización de tu pedido',
		expect.stringContaining('pago fue confirmado'),
		expect.objectContaining({ id_pedido: String(id_pedido) }),
		);
	});

	it('CP-007 (RF-007.2): el admin/trabajador consulta el listado de todos los pedidos con su estado', async () => {
		prisma.pedido.findMany.mockResolvedValue([
		fakePedidoDetalleCompleto({ id_pedido: 1, estado: 'Pendiente' }),
		fakePedidoDetalleCompleto({ id_pedido: 2, estado: 'Entregado' }),
		]);

		const resultado = await service.findAll({});

		expect(prisma.pedido.findMany).toHaveBeenCalledWith(
		expect.objectContaining({ orderBy: { fecha: 'desc' } }),
		);
		expect(resultado).toHaveLength(2);
	});

	it.todo('CP-008 (RF-007.2): denegar a un cliente el acceso al pedido de otro cliente — sin chequeo de propiedad en PedidosService.findOne, corresponde al controller/guard');

	it('debe traer el detalle completo de un pedido existente (findOne)', async () => {
		prisma.pedido.findFirst.mockResolvedValue(fakePedidoDetalleCompleto({ id_pedido: 42 }));

		const resultado = await service.findOne(42);

		expect(resultado.id_pedido).toBe(42);
		expect(resultado.detalles_pedido).toBeDefined();
	});

	// RF-008.2 - Actualizar estado de pedido
	it('CP-005 (RF-008.2): el administrador/trabajador cambia manualmente el estado del pedido', async () => {
		const id_pedido = faker.number.int({ min: 1, max: 9999 });

		prisma.pedido.findFirst.mockResolvedValue(
		fakePedidoDetalleCompleto({ id_pedido, estado: 'Pendiente' }),
		);
		prisma.pedido.update.mockResolvedValue({ id_pedido, estado: 'En preparación' });

		const resultado = await service.update(id_pedido, { estado: 'En preparación' } as any);

		expect(prisma.pedido.update).toHaveBeenCalledWith({
		where: { id_pedido },
		data: { estado: 'En preparación' },
		});
		expect(resultado.estado).toBe('En preparación');
	});

	// RF-008.3 - Actualizar método de pago
	it('CP-006 (RF-008.3): debe registrar el método de pago utilizado en el ticket asociado', async () => {
		const id_pedido = faker.number.int({ min: 1, max: 9999 });

		prisma.pedido.findFirst.mockResolvedValue(
		fakePedidoDetalleCompleto({ id_pedido, estado: 'Pendiente' }),
		);
		prisma.pedido.update.mockResolvedValue({ id_pedido });
		prisma.ticket_compra.updateMany.mockResolvedValue({ count: 1 });

		await service.update(id_pedido, { metodo_pago: 'Nequi' } as any);

		expect(prisma.ticket_compra.updateMany).toHaveBeenCalledWith({
		where: { id_pedido },
		data: { id_met_pago: 'Mtd_NQ' },
		});
	});

	// RF-008.4 - Consultar tickets y pedidos realizados
	it('CP-007 (RF-008.4): el usuario puede visualizar el historial completo de sus pedidos', async () => {
		const id_usuario = faker.string.uuid();
		prisma.pedido.findMany.mockResolvedValue([
		fakePedidoDetalleCompleto({ id_pedido: 1, id_usuario }),
		fakePedidoDetalleCompleto({ id_pedido: 2, id_usuario }),
		]);

		const resultado = await service.findByUsuario(id_usuario);

		expect(prisma.pedido.findMany).toHaveBeenCalledWith(
		expect.objectContaining({ where: { id_usuario }, orderBy: { fecha: 'desc' } }),
		);
		expect(resultado).toHaveLength(2);
	});

	// CP-008/CP-009 piden filtrar el historial por tipo "Estándar" vs
	it.todo('CP-008 (RF-008.4): filtrar el historial para mostrar solo pedidos estándar — findByUsuario() no acepta filtro por tipo');
	it.todo('CP-009 (RF-008.4): filtrar el historial para mostrar solo pedidos personalizados — findByUsuario() no acepta filtro por tipo');

	it('CP-010 (RF-008.4): debe abrir el detalle completo de un pedido específico del listado', async () => {
		prisma.pedido.findFirst.mockResolvedValue(fakePedidoDetalleCompleto({ id_pedido: 15 }));

		const resultado = await service.findOne(15);

		expect(resultado.ticket_compra).toBeDefined();
		expect(resultado.usuario).toBeDefined();
	});

	// RF-007.3 - Cancelar/anular pedido
	it('CP-009: el admin anula un pedido en estado "Pendiente" y el cliente recibe notificación', async () => {
		const id_pedido = faker.number.int({ min: 1, max: 9999 });
		const id_usuario = faker.string.uuid();

		prisma.pedido.findFirst.mockResolvedValue({
		id_pedido,
		estado: 'Pendiente',
		id_usuario,
		});
		prisma.pedido.update.mockResolvedValue({
		id_pedido,
		estado: 'Anulado',
		});

		const resultado = await service.update(id_pedido, { estado: 'Anulado' } as any);

		expect(prisma.pedido.update).toHaveBeenCalledWith({
		where: { id_pedido },
		data: { estado: 'Anulado' },
		});
		expect(resultado.estado).toBe('Anulado');
		expect(fcmPush.notificarUsuario).toHaveBeenCalledWith(
		id_usuario,
		expect.any(String),
		expect.any(String),
		expect.objectContaining({ id_pedido: String(id_pedido) }),
		);
	});

	it('CP-010: NO debe permitir anular un pedido que ya está "Entregado"', async () => {
		const id_pedido = faker.number.int({ min: 1, max: 9999 });

		prisma.pedido.findFirst.mockResolvedValue({
		id_pedido,
		estado: 'Entregado',
		id_usuario: faker.string.uuid(),
		});

		await expect(
		service.update(id_pedido, { estado: 'Anulado' } as any),
		).rejects.toThrow(BadRequestException);
	});

	it('debe lanzar NotFoundException si el pedido a anular no existe', async () => {
		prisma.pedido.findFirst.mockResolvedValue(null);

		await expect(
		service.update(999999, { estado: 'Anulado' } as any),
		).rejects.toThrow(NotFoundException);
	});
});