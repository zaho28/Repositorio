import { faker } from '@faker-js/faker';
import {
    PrismaClient,
    tipo_documento_t_doc,
    tipo_pedido_id_tipo,
    estado_pago_id_estado,
    metodo_pago_id_met_pago,
    tipo_movimiento_id_m,
    material_tipo,
    material_unidad,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ID que ya existen en gurama_test 
export const CATALOGOS = {
    ROL_CLIENTE: '2',
    ROL_ADMIN: '1',
    ROL_TRABAJADOR: '3',
    TIPO_DOC_CC: tipo_documento_t_doc.CC,
    CATEGORIAS: [1, 2, 3, 4, 5, 6, 7, 8],
    CLASIFICACIONES: [1, 2, 3, 4, 5],
    };

    export async function crearUsuarioFake(idRol: string = CATALOGOS.ROL_CLIENTE) {
    const contrasenaFake = 'Test1234!';
    const contrasenaHash = await bcrypt.hash(contrasenaFake, 10);

    const usuario = await prisma.usuario.create({
        data: {
        id_usuario: faker.string.numeric(10), // simula un número de cédula
        nom_1: faker.person.firstName(),
        ape_1: faker.person.lastName(),
        correo: faker.internet.email(),
        telefono: BigInt(faker.string.numeric(10)),
        contrasena: contrasenaHash,
        id_rol_usuario: idRol,
        t_doc: CATALOGOS.TIPO_DOC_CC,
        estado: 1,
        },
    });

    return { usuario, contrasenaFake };
    }

    export async function crearAdminFake(idRol: string = CATALOGOS.ROL_ADMIN) {
    const contrasenaFake = 'Admin1234!';
    const contrasenaHash = await bcrypt.hash(contrasenaFake, 10);
    const codigofake = faker.string.numeric(6); 
    const codigoHash = await bcrypt.hash(codigofake, 10);

    const usuario = await prisma.usuario.create({
        data: {
        id_usuario: faker.string.numeric(10), // simula un número de cédula
        nom_1: faker.person.firstName(),
        ape_1: faker.person.lastName(),
        correo: faker.internet.email(),
        telefono: BigInt(faker.string.numeric(10)),
        contrasena: contrasenaHash,
        id_rol_usuario: idRol,
        t_doc: CATALOGOS.TIPO_DOC_CC,
        estado: 1,
        codigo: codigoHash, 
        },
    });

    return { usuario, codigofake };
    }

    //Crea un producto real en gurama_test con stock definido,
    export async function crearProductoFake(stock: number = 20) {
    return prisma.producto.create({
        data: {
        nom_producto: faker.commerce.productName(),
        precio_unitario: faker.number.float({ min: 10000, max: 80000, fractionDigits: 2 }),
        stock_actual: stock,
        stock_minimo: 5,
        ultima_actualiz: new Date(),
        descripcion: faker.commerce.productDescription().slice(0, 255),
        id_categoria: faker.helpers.arrayElement(CATALOGOS.CATEGORIAS),
        id_clasificacion: faker.helpers.arrayElement(CATALOGOS.CLASIFICACIONES),
        estado: true,
        },
    });
    }

    //Crea un movimiento real de inventario 
    export async function crearMovimientoFake(
    id_producto: number,
    id_usuario: string,
    overrides: Partial<{ Cantidad_m: number; id_m: tipo_movimiento_id_m; observaciones: string }> = {},
    ) {
    return prisma.movimiento.create({
        data: {
        Cantidad_m: overrides.Cantidad_m ?? faker.number.int({ min: 1, max: 20 }),
        fecha_m: new Date(),
        observaciones: overrides.observaciones ?? faker.lorem.sentence(),
        id_m: overrides.id_m ?? tipo_movimiento_id_m.M_E,
        id_producto,
        id_usuario,
        id_material: null,
        },
    });
    }

    //Crea un pedido real (sin ticket ni detalle) para un usuario existente.
    export async function crearPedidoFake(
    id_usuario: string,
    overrides: Partial<{ estado: string; id_tipo: tipo_pedido_id_tipo }> = {},
    ) {
    return prisma.pedido.create({
        data: {
        fecha: new Date(),
        estado: overrides.estado ?? 'Pendiente',
        id_usuario,
        id_tipo: overrides.id_tipo ?? tipo_pedido_id_tipo.P_E,
        },
    });
    }

    //Crea un ticket de compra real asociado a un pedido existente.
    export async function crearTicketFake(
    id_pedido: number,
    overrides: Partial<{
        sub_total: number;
        total_ticket: number;
        id_estado: estado_pago_id_estado;
        id_met_pago: metodo_pago_id_met_pago;
    }> = {},
    ) {
    return prisma.ticket_compra.create({
        data: {
        num_ticket: faker.number.int({ min: 100000, max: 999999 }),
        fecha_emision: new Date(),
        sub_total: overrides.sub_total ?? faker.number.float({ min: 10000, max: 50000, fractionDigits: 2 }),
        total_ticket: overrides.total_ticket ?? faker.number.float({ min: 10000, max: 50000, fractionDigits: 2 }),
        id_pedido,
        id_estado: overrides.id_estado ?? estado_pago_id_estado.E_pd,
        id_met_pago: overrides.id_met_pago ?? metodo_pago_id_met_pago.Mtd_PD,
        },
    });
    }

    //Pedido completo
    export async function crearPedidoCompletoFake(
    id_usuario: string,
    id_producto: number,
    overrides: Partial<{ cantidad: number; estado: string }> = {},
    ) {
    const pedido = await crearPedidoFake(id_usuario, { estado: overrides.estado });
    const cantidad = overrides.cantidad ?? faker.number.int({ min: 1, max: 3 });

    await prisma.detalles_pedido.create({
        data: {
        descrip_detalles: faker.commerce.productName(),
        cantidad,
        id_pedido: pedido.id_pedido,
        id_producto,
        },
    });

    const ticket = await crearTicketFake(pedido.id_pedido);

    return { pedido, ticket };
    }

    //Crea una notificación
    export async function crearNotificacionFake(
    id_usuario: string,
    overrides: Partial<{
        titulo: string;
        mensaje: string;
        tipo: 'pedido_estado' | 'stock_bajo' | 'pedido_nuevo';
        leida: boolean;
    }> = {},
    ) {
    return prisma.notificacion.create({
        data: {
        id_usuario,
        titulo: overrides.titulo ?? 'Notificación de prueba',
        mensaje: overrides.mensaje ?? faker.lorem.sentence(),
        tipo: overrides.tipo ?? 'pedido_nuevo',
        leida: overrides.leida ?? false,
        },
    });
    }

    //crear material
    export async function crearMaterialFake(
    overrides: Partial<{
        tipo: material_tipo;
        unidad: material_unidad;
        precio_unitario: number;
        stock_actual: number;
    }> = {},
    ) {
    return prisma.material.create({
        data: {
        nombre: faker.commerce.productMaterial(),
        tipo: overrides.tipo ?? material_tipo.Tela,
        unidad: overrides.unidad ?? material_unidad.metro,
        precio_unitario:
            overrides.precio_unitario ?? faker.number.float({ min: 5000, max: 30000, fractionDigits: 2 }),
        stock_actual: overrides.stock_actual ?? 20,
        stock_minimo: 5,
        estado: true,
        },
    });
    }

    //Crea un color real asociado a un material (tela) existente. 
    export async function crearColorMaterialFake(id_material: number, nombre: string = 'Azul') {
    return prisma.material_color.create({
        data: {
        id_material,
        nombre,
        codigo_hex: '#0000FF',
        estado: true,
        },
    });
    }

    /** Crea un diseño real asociado a un material (tela) existente. */
    export async function crearDisenoMaterialFake(id_material: number, nombre: string = 'Flores') {
    return prisma.material_diseno.create({
        data: {
        id_material,
        nombre,
        estado: true,
        },
    });
    }

    export async function limpiarDatosDePrueba() {
    await prisma.notificacion.deleteMany();
    await prisma.ticket_compra.deleteMany();
    await prisma.detalles_pedido.deleteMany();
    await prisma.detalle_pedido_personalizado.deleteMany();
    await prisma.pedido_personalizado.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.movimiento.deleteMany();
    await prisma.material_color.deleteMany();
    await prisma.material_diseno.deleteMany();
    await prisma.material.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.usuario.deleteMany();
    }

    export async function cerrarConexionFaker() {
    await prisma.$disconnect();
}