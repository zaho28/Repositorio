"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const roles = [
        { id_rol_usuario: '1', nombre_rol: 'Administrador' },
        { id_rol_usuario: '2', nombre_rol: 'Cliente' },
        { id_rol_usuario: '3', nombre_rol: 'Trabajador' },
    ];
    for (const r of roles) {
        await prisma.rol_usuario.upsert({ where: { id_rol_usuario: r.id_rol_usuario }, update: {}, create: r });
    }
    await prisma.tipo_documento.upsert({
        where: { t_doc: 'CC' },
        update: {},
        create: { t_doc: 'CC', desc_doc: 'C_dula_de_ciudadan_a' }
    });
    const categorias = [
        { nombre_c: 'Sabanas' },
        { nombre_c: 'Cubrelechos' },
        { nombre_c: 'Amigurumis' },
        { nombre_c: 'Llaveros' },
    ];
    for (const c of categorias) {
        await prisma.categoria.create({ data: c });
    }
    const estados = [
        { id_estado: 'E_pt', nom_metodo: 'Pendiente' },
        { id_estado: 'E_pd', nom_metodo: 'Pagado' },
    ];
    for (const e of estados) {
        await prisma.estado_pago.upsert({ where: { id_estado: e.id_estado }, update: {}, create: e });
    }
    await prisma.usuario.upsert({
        where: { id_usuario: 'Adm-01' },
        update: {},
        create: {
            id_usuario: 'Adm-01',
            nom_1: 'Valentina',
            ape_1: 'Ruiz',
            correo: 'valruiz@gmail.com',
            telefono: 3123456789,
            contrasena: '$2b$10$ZpYbdvjxoxOFc9H1WE.9v.sSNaEvHqRHlThGiMvDAYy/StkwtxK6a',
            id_rol_usuario: '1',
            t_doc: 'CC',
            codigo_visible: '12345'
        }
    });
    const colores = [
        { id_material: 1, nombre: 'Blanco', codigo_hex: '#FFFFFF' },
        { id_material: 1, nombre: 'Negro', codigo_hex: '#1A1A1A' },
        { id_material: 1, nombre: 'Azul cielo', codigo_hex: '#87CEEB' },
        { id_material: 1, nombre: 'Rosa palo', codigo_hex: '#FFB6C1' },
        { id_material: 1, nombre: 'Verde menta', codigo_hex: '#98FF98' },
        { id_material: 1, nombre: 'Gris perla', codigo_hex: '#D3D3D3' },
        { id_material: 5, nombre: 'Blanco', codigo_hex: '#FFFFFF' },
        { id_material: 5, nombre: 'Beige', codigo_hex: '#F5F0DC' },
        { id_material: 5, nombre: 'Gris oscuro', codigo_hex: '#4A4A4A' },
        { id_material: 5, nombre: 'Azul marino', codigo_hex: '#001F5B' },
        { id_material: 6, nombre: 'Blanco', codigo_hex: '#FFFFFF' },
        { id_material: 6, nombre: 'Gris', codigo_hex: '#808080' },
        { id_material: 6, nombre: 'Crema', codigo_hex: '#FFFDD0' },
        { id_material: 7, nombre: 'Blanco', codigo_hex: '#FFFFFF' },
        { id_material: 7, nombre: 'Gris claro', codigo_hex: '#C0C0C0' },
        { id_material: 7, nombre: 'Rosado', codigo_hex: '#FFC0CB' },
    ];
    for (const c of colores) {
        await prisma.material_color.create({ data: c });
    }
    const disenos = [
        { id_material: 4, nombre: 'Flores pequeñas', ruta_imagen: null },
        { id_material: 4, nombre: 'Rayas horizontales', ruta_imagen: null },
        { id_material: 4, nombre: 'Puntos', ruta_imagen: null },
        { id_material: 4, nombre: 'Cuadros escoceses', ruta_imagen: null },
        { id_material: 4, nombre: 'Animales cartoon', ruta_imagen: null },
        { id_material: 4, nombre: 'Geométrico', ruta_imagen: null },
    ];
    for (const d of disenos) {
        await prisma.material_diseno.create({ data: d });
    }
    console.log('Base de datos GuramaOnline poblada con éxito.');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=seed.js.map