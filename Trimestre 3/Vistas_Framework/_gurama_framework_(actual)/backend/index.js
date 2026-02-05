const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // Para el manejo de imagenes
const path = require('path'); // 'path' para servir archivos estáticos

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

//condfigarar bd mysql

const db = mysql.createConnection ( {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'guramaOnline',
})

//crera constancia a la bd 

db.connect(err =>{ 
    if (err) {
        console.error('Error de conexión'+err.stack)  //si hay error mostar mensaje y error 
        return
    }
    console.log('Conectado a la base de datos')  //si no mostar mensaje
})

// Pasamos la conexión 'db' a la función exportada del router.
const usuariosRoutes = require('./routes/usuarios')(db);
const productosRoutes = require('./routes/productos')(db);
const categoriasRouter = require('./routes/categorias')(db);
const clasificacionesRouter = require('./routes/clasificaciones')(db);
const movimientosRouter = require('./routes/movimientos')(db);
const pedidosRouter = require('./routes/pedidos')(db);
const notificacionesRouter = require('./routes/notificaciones')(db);


// Asignar una URL base para las rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRouter);
app.use('/api/clasificaciones', clasificacionesRouter);
app.use('/api/movimientos', movimientosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/notificaciones', notificacionesRouter);

// iniciar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`)
})