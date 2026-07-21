// RF-005.1 / RF-005.2
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { loginComoCliente } from '../utils/auth-helper';
import {
  crearMaterialFake,
  crearColorMaterialFake,
  crearDisenoMaterialFake,
  limpiarDatosDePrueba,
  cerrarConexionFaker,
} from '../utils/faker-factories';

describe('PedidosPersonalizados (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await limpiarDatosDePrueba();
  });

  afterAll(async () => {
    await cerrarConexionFaker();
    await app.close();
  });

  // RF-005.1 - Personalizar producto
  describe('GET /pedidos-personalizados/materiales/:id/colores|disenos', () => {
    it('CP-003: filtra colores y diseños según la tela (material) seleccionada', async () => {
      const { token } = await loginComoCliente(app);
      const tela = await crearMaterialFake({ tipo: 'Tela' });
      await crearColorMaterialFake(tela.id_material, 'Azul');
      await crearDisenoMaterialFake(tela.id_material, 'Flores');

      const resColores = await request(app.getHttpServer())
        .get(`/pedidos-personalizados/materiales/${tela.id_material}/colores`)
        .set('Authorization', `Bearer ${token}`);

      const resDisenos = await request(app.getHttpServer())
        .get(`/pedidos-personalizados/materiales/${tela.id_material}/disenos`)
        .set('Authorization', `Bearer ${token}`);

      expect(resColores.status).toBe(200);
      expect(resColores.body.length).toBeGreaterThan(0);
      expect(resDisenos.status).toBe(200);
      expect(resDisenos.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /pedidos-personalizados', () => {
    it('CP-002: personaliza una sábana con tamaño, tela y color', async () => {
      const { usuario, token } = await loginComoCliente(app);
      const tela = await crearMaterialFake({ tipo: 'Tela', stock_actual: 20 });

      const res = await request(app.getHttpServer())
        .post('/pedidos-personalizados')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          tipo_producto: 'Sabana',
          tamanio: 'Doble',
          materiales: [{ id_material: tela.id_material, cantidad: 2 }],
        });

      expect(res.status).toBe(201);
      expect(res.body.precio_total).toBeGreaterThan(0);
    });

    it('CP-004: no permite confirmar la personalización si faltan campos obligatorios', async () => {
      const { usuario, token } = await loginComoCliente(app);

      const res = await request(app.getHttpServer())
        .post('/pedidos-personalizados')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          materiales: [],
          // tipo_producto y tamaño faltan a propósito
        });

      expect(res.status).toBe(400);
    });

    it('CP-004 (adaptado): rechaza el pedido si un material no tiene stock suficiente', async () => {
      const { usuario, token } = await loginComoCliente(app);
      const tela = await crearMaterialFake({ tipo: 'Tela', stock_actual: 1 });

      const res = await request(app.getHttpServer())
        .post('/pedidos-personalizados')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_usuario: usuario.id_usuario,
          tipo_producto: 'Cubrelecho',
          tamanio: 'Queen',
          materiales: [{ id_material: tela.id_material, cantidad: 5 }],
        });

      expect(res.status).toBe(400);
    });
  });

  it.todo(
    'CP-001 (RF-005.1): personalizar un cubrelecho con opciones individuales para Lado 1 y Lado 2 — el DTO actual (materiales[]) no distingue "lado"; confirmar con el equipo cómo se modela esa selección (¿un campo "lado" por ítem?) antes de escribir el caso exacto',
  );
  it.todo(
    'CP-006 (RF-005.2): mostrar el desglose del precio antes de añadir al carrito — comportamiento de p_sabanas.jsx/p_cubrelecho.jsx en frontend, no aplica a e2e de backend',
  );
  it.todo(
    'CP-007 (RF-005.2): estabilidad del precio al cambiar constantemente de opciones — estado de React en frontend, no aplica a e2e de backend',
  );
});
