===============================
            BACKEND
================================

cd backend

----inicializar el proyecto de node.js-----

backend> npm init (enter y yes)

----instalar dependencias del backend-----
npm install mysql express cors nodemon

===================================================================
En el archivo package.json generar llamado para servidor node mode

"scripts": {
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
    ...}
===================================================================
Crear archivo index.js para configurar el servidor y puntos de entrada

===================
lanzar por medio de
npm run dev

=========================
        Estructura
=========================
backend/
├── node_modules/
├── index.js      <-- Archivo Principal: configura Express, CORS y conecta módulos.
├── package.json
└── routes/           <-- carpeta para las rutas que llamara el index.js
    ├── usuario.js    <-- Rutas CRUD para la tabla 'usuarios' (Contiene GET(Read), POST(Create), PUT(Update), DELETE(Delete))
    ├── productos.js  <-- Rutas CRUD para la tabla 'productos'
    └── etc...


*Express (El framework de Node.js.):Es la estructura (o esqueleto) del servidor. Sin Express, solo tendrías un motor (Node.js), pero no las herramientas para definir rutas (/usuario, /productos) o recibir peticiones web.

*CORS: Permite que el frontend de React (que corre en una dirección o puerto, ej. localhost:3000) pueda hablar y pedir datos a el backend de Node.js (que corre en otra dirección, ej. localhost:3001). Sin CORS, el navegador bloquearía la comunicación por seguridad.

*Módulos: La redireccion al CRUD de un archivo de la carpeta routes. Ej: /api/usuario/add que aplica la logica de usuario.js





==================================================
Notas Importantes para el Backend (Node.js/Express)
==================================================
Para que el manejo de la imagen y los datos funcione correctamente con FormData, el servidor (backend) debe estar configurado para recibir datos multipart.

*Instalar un middleware como multer.

npm install multer

*Instalar la libreria ReCharts para generar graficos
https://youtu.be/xl5XZsOTvzY
