const express = require('express');
const Cliente = require('./models/Cliente'); // Importamos tu modelo

const app = express();

// Esto es vital: le dice a Express que entienda los datos en formato JSON
app.use(express.json());

// Creamos la ruta (endpoint) para registrar clientes
app.post('/api/clientes/registro', async (req, res) => {
  try {
    const datosCliente = req.body; // Aquí viene la info del frontend/test

    // 1. Validamos que vengan los datos obligatorios (igual que en tu funciones.js)
    if (!datosCliente.id_usuario || !datosCliente.nom_1 || !datosCliente.ape_1 || !datosCliente.correo || !datosCliente.telefono || !datosCliente.contrasena || !datosCliente.t_doc) {
      // status 400 significa "Bad Request" (Petición incorrecta)
      return res.status(400).json({ error: 'Faltan datos obligatorios para el registro' });
    }

    // 2. Buscamos si ya existe alguien con ese documento en la BD de SQLite
    const clienteExistente = await Cliente.findByPk(datosCliente.id_usuario);
    if (clienteExistente) {
      return res.status(400).json({ error: 'El número de documento ya se encuentra registrado' });
    }

    // 3. Si todo está bien, lo guardamos en la base de datos real
    const nuevoCliente = await Cliente.create(datosCliente);
    
    // status 201 significa "Created" (Creado exitosamente)
    return res.status(201).json({
      success: true,
      mensaje: 'Cliente registrado exitosamente',
      cliente: nuevoCliente
    });

  } catch (error) {
    // Si SQLite falla por alguna razón (como un correo duplicado), cae aquí
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exportamos la app para que las pruebas (Supertest) puedan usarla
module.exports = app;