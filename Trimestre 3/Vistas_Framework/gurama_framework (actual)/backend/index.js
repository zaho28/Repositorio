const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // Para el manejo de imagenes


const app = express();
app.use(cors());
app.use(express.json());

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
// Asignar una URL base para las rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRouter);
app.use('/api/clasificaciones', clasificacionesRouter);


// iniciar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`)
})