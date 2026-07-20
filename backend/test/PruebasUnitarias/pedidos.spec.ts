//RF-007.1-7.3 y RF-008.1-8.4
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { PedidosService } from '../../src/pedidos/pedidos.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { FcmPushService } from '../../src/notificaciones/fcm-push.service';

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

	// prepara todo lo que cada test va a necesitar
	beforeEach(async () => {
		jest.clearAllMocks();

		prisma = {
			$transaction: jest.fn((callback) => callback(mockTx)),
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

	// RF-008.1 - Generar ticket de pedido (automático)

	it('CP-001: debe generar un ticket al confirmar un pedido estándar', async () => {
		// Crear los datos del pedido
		const id_producto = faker.number.int({ min: 1, max: 1000 });
		const cantidad = faker.number.int({ min: 1, max: 3 });
		const precio = faker.number.float({ min: 10000, max: 50000, fractionDigits: 2 });

		mockTransaccionExitosa(id_producto, cantidad + 10); // stock suficiente

		// Crear el objeto con el pedido a confirmar
		const dto = {
			id_usuario: faker.string.uuid(),
			metodo_pago: 'Efectivo',
			subtotal: precio * cantidad,
			total: precio * cantidad,
			items: [{ id_producto, cantidad, precio }],
		};

		const resultado = await service.create(dto as any);

		// Verificar que el llamado fue exitoso y que el ticket se generó
		expect(resultado.success).toBe(true);
		expect(mockTx.ticket_compra.create).toHaveBeenCalledTimes(1);
		expect(resultado.data.num_ticket).toBeDefined();
		expect(typeof resultado.data.num_ticket).toBe('number');
	});
});