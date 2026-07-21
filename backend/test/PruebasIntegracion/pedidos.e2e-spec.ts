// RF-007.1 / RF-007.2 / RF-007.3 / RF-008.1 / RF-008.2 / RF-008.3 / RF-008.4
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { loginComoCliente, loginConCodigo } from '../utils/auth-helper';
import {
  crearProductoFake,
  crearPedidoFake,
  crearPedidoCompletoFake,
  limpiarDatosDePrueba,
  cerrarConexionFaker,
} from '../utils/faker-factories';

describe('Pedidos (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await limpiarDatosDePrueba(); //limpiar despues de cada test
  });

  afterAll(async () => {
    await cerrarConexionFaker();
    await app.close();
  });

  // RF-007.1 - Registrar pedido
  describe('POST /pedidos', () => {
    it('CP-001: confirma un pedido estándar con stock suficiente', async () => {
      const { usuario, token } = await loginComoCliente(app);
      const producto = await crearProductoFake(20);
      const precio = Number(producto.precio_unitario);

      const res = await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          metodo_pago: 'Efectivo',
          subtotal: precio * 2,
          total: precio * 2,
          items: [{ id_producto: producto.id_producto, cantidad: 2, precio }],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.productos_procesados).toBe(1);
      expect(res.body.data.detalles[0].stock_restante).toBe(18);
    });

    it('CP-002: rechaza el pedido si un producto no tiene stock suficiente', async () => {
      const { usuario, token } = await loginComoCliente(app);
      const producto = await crearProductoFake(2); // solo 2 unidades en stock

      const res = await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          metodo_pago: 'Efectivo',
          subtotal: 100000,
          total: 100000,
          items: [{ id_producto: producto.id_producto, cantidad: 5, precio: Number(producto.precio_unitario) }],
        });

      expect(res.status).toBe(400);
    });

    it('CP-003: no permite confirmar un pedido con el carrito vacío', async () => {
      const { usuario, token } = await loginComoCliente(app);

      const res = await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          metodo_pago: 'Efectivo',
          subtotal: 0,
          total: 0,
          items: [],
        });

      expect(res.status).toBe(400);
    });

    it('CP-004: un usuario sin sesión (sin token) no puede registrar un pedido', async () => {
      const producto = await crearProductoFake(10);

      const res = await request(app.getHttpServer())
        .post('/pedidos')
        .send({
          id_usuario: 'sin-sesion',
          metodo_pago: 'Efectivo',
          subtotal: 10000,
          total: 10000,
          items: [{ id_producto: producto.id_producto, cantidad: 1, precio: 10000 }],
        });

      expect(res.status).toBe(401);
    });

    it('rechaza el pedido si contiene el mismo producto duplicado (guard extra del service)', async () => {
      const { usuario, token } = await loginComoCliente(app);
      const producto = await crearProductoFake(10);
      const precio = Number(producto.precio_unitario);

      const res = await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          metodo_pago: 'Efectivo',
          subtotal: precio * 2,
          total: precio * 2,
          items: [
            { id_producto: producto.id_producto, cantidad: 1, precio },
            { id_producto: producto.id_producto, cantidad: 1, precio },
          ],
        });

      expect(res.status).toBe(400);
    });
  });

  // RF-007.2 - Consultar/ver estado de pedido
  describe('GET /pedidos', () => {
    it('CP-007: el admin/trabajador consulta el listado de todos los pedidos con su estado', async () => {
      const { token: tokenAdmin } = await loginConCodigo(app);
      const { usuario } = await loginComoCliente(app);
      await crearPedidoFake(usuario.id_usuario, { estado: 'Pendiente' });

      const res = await request(app.getHttpServer())
        .get('/pedidos')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // RF-007.3 - Cancelar/anular pedido
  describe('PATCH /pedidos/:id (anular)', () => {
    it('CP-009: el admin anula un pedido en estado "Pendiente"', async () => {
      const { token: tokenAdmin } = await loginConCodigo(app);
      const { usuario } = await loginComoCliente(app);
      const pedido = await crearPedidoFake(usuario.id_usuario, { estado: 'Pendiente' });

      const res = await request(app.getHttpServer())
        .patch(`/pedidos/${pedido.id_pedido}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ estado: 'Anulado' });

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe('Anulado');
    });

    it('CP-010: no permite anular un pedido ya "Entregado" (estado inmutable)', async () => {
      const { token: tokenAdmin } = await loginConCodigo(app);
      const { usuario } = await loginComoCliente(app);
      const pedido = await crearPedidoFake(usuario.id_usuario, { estado: 'Entregado' });

      const res = await request(app.getHttpServer())
        .patch(`/pedidos/${pedido.id_pedido}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ estado: 'Anulado' });

      expect(res.status).toBe(400);
    });
  });

  // RF-008.1 - Generar ticket de pedido (automático)
  describe('Ticket automático al confirmar el pedido', () => {
    it('CP-001/CP-003 (RF-008.1): el ticket se crea junto al pedido con estado "Pendiente" por defecto', async () => {
      const { usuario, token } = await loginComoCliente(app);
      const producto = await crearProductoFake(10);
      const precio = Number(producto.precio_unitario);

      const resCrear = await request(app.getHttpServer())
        .post('/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          metodo_pago: 'Efectivo',
          subtotal: precio,
          total: precio,
          items: [{ id_producto: producto.id_producto, cantidad: 1, precio }],
        });

      const idPedido = resCrear.body.data.id_pedido;

      const resDetalle = await request(app.getHttpServer())
        .get(`/pedidos/detalle/${idPedido}`)
        .set('Authorization', `Bearer ${token}`);

      expect(resDetalle.status).toBe(200);
      expect(resDetalle.body.ticket_compra.id_estado).toBe('E_pd');
      expect(resDetalle.body.ticket_compra.id_met_pago).toBe('Mtd_PD');
    });
  });

  it.todo(
    'CP-002 (RF-008.1): generación de ticket para pedidos personalizados — cubierto en pedidos-personalizados.e2e-spec.ts',
  );
  it.todo(
    'CP-004 (RF-008.1): num_ticket único/secuencial — restricción @unique en BD (num_ticket)',
  );

  // RF-008.2 - Actualizar estado de pedido
  describe('PATCH /pedidos/:id (estado)', () => {
    it('CP-005: el administrador/trabajador cambia manualmente el estado del pedido', async () => {
      const { token: tokenAdmin } = await loginConCodigo(app);
      const { usuario } = await loginComoCliente(app);
      const pedido = await crearPedidoFake(usuario.id_usuario, { estado: 'Pendiente' });

      const res = await request(app.getHttpServer())
        .patch(`/pedidos/${pedido.id_pedido}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ estado: 'En preparación' });

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe('En preparación');
    });
  });

  // RF-008.3 - Actualizar método de pago
  describe('PATCH /pedidos/:id (metodo_pago)', () => {
    it('CP-006: registra el método de pago utilizado en el ticket asociado', async () => {
      const { token: tokenAdmin } = await loginConCodigo(app);
      const { usuario } = await loginComoCliente(app);
      const producto = await crearProductoFake(10);
      const { pedido } = await crearPedidoCompletoFake(usuario.id_usuario, producto.id_producto);

      const res = await request(app.getHttpServer())
        .patch(`/pedidos/${pedido.id_pedido}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ metodo_pago: 'Nequi' });

      expect(res.status).toBe(200);

      const resDetalle = await request(app.getHttpServer())
        .get(`/pedidos/detalle/${pedido.id_pedido}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(resDetalle.body.ticket_compra.id_met_pago).toBe('Mtd_NQ');
    });
  });


  // RF-008.4 - Consultar tickets y pedidos realizados
  describe('GET /pedidos/detalle/:id', () => {
    it('CP-010: abre y consulta el detalle completo de un pedido específico', async () => {
      const { usuario, token } = await loginComoCliente(app);
      const producto = await crearProductoFake(10);
      const { pedido } = await crearPedidoCompletoFake(usuario.id_usuario, producto.id_producto);

      const res = await request(app.getHttpServer())
        .get(`/pedidos/detalle/${pedido.id_pedido}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id_pedido).toBe(pedido.id_pedido);
      expect(res.body.detalles_pedido.length).toBeGreaterThan(0);
    });
  });
});
