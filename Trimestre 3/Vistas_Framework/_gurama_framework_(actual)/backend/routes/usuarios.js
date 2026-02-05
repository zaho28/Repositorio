const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // cotraseña co hash
const multer = require('multer'); // subir imagenes
const path = require('path');
const nodemailer = require('nodemailer'); // envio de codigo

// Número de rondas de salt (10 es el estándar recomendado)
const SALT_ROUNDS = 10;

// ALMACÉN DE CÓDIGOS DE VERIFICACIÓN
const verificationCodes = new Map()

// ===================================
// CONFIGURACIÓN DE NODEMAILER
// ===================================

require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER='guramaonline@gmail.com', // correo completo 
        pass: process.env.EMAIL_PASSWORD='giut xtju bdtx yzfa' // Contraseña de aplicación de 16 dígitos  
    },
    tls: {
        rejectUnauthorized: false // Solo para desarrollo
    }
});

// Para pruebas directas 
/*
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'guramaonline@gmail.com',
        pass: 'giut xtju bdtx yzfa'
    }
});
*/

// Verificar conexión al iniciar
transporter.verify(function(error, success) {
    if (error) {
        console.error('Error en configuración de email:', error);
    } else {
        console.log('Servidor de email listo');
    }
});


// ===================================
// CONFIGURACIÓN DE MULTER (assets)
// ===================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('assets/perfil'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const id_usuario = req.params.id_usuario || req.body.id_usuario; 
        cb(null, `${id_usuario}-${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});

module.exports = (db) => {

    // ----------------------------------------------------------------
    // RUTA POST (Subir/Actualizar Imagen de Perfil)
    // ----------------------------------------------------------------
    router.post('/upload-image/:id_usuario', upload.single('profileImage'), (req, res) => {
        const { id_usuario } = req.params;

        if (!req.file) {
            return res.status(400).send({ message: "No se seleccionó ninguna imagen." });
        }

        const imagePath = `/perfil/${req.file.filename}`;
        const query = `UPDATE usuario SET img_perfil = ? WHERE id_usuario = ?`;
        const values = [imagePath, id_usuario];

        db.query(query, values, (err, results) => {
            if (err) {
                console.error("Error DB al actualizar ruta de imagen:", err);
                return res.status(500).send({ error: 'Error al actualizar la ruta de la imagen en DB.', details: err.sqlMessage });
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).send({ message: "Usuario no encontrado." });
            }

            res.json({ 
                message: "Imagen de perfil subida y ruta guardada exitosamente.", 
                img_perfil: imagePath 
            });
        });
    });

    // ----------------------------------------------------------------
    // RUTA GET (Leer todos los usuarios)
    // ----------------------------------------------------------------
    router.get('/', (req, res) => {
        const query = `
            SELECT 
                u.id_usuario, u.nom_1, u.nom_2, u.ape_1, u.ape_2, 
                u.correo, u.telefono, u.id_rol_usuario, u.t_doc, u.img_perfil,
                u.codigo_visible,
                r.nombre_rol, 
                t.desc_doc
            FROM 
                usuario u
            JOIN 
                rol_usuario r ON u.id_rol_usuario = r.id_rol_usuario
            JOIN 
                tipo_documento t ON u.t_doc = t.t_doc;
        `;

        db.query(query, (err, results) => {
            if(err){
                return res.status(500).send({error: "Error al obtener los usuarios.", details: err.message});
            }
            // NO devolver contraseñas ni códigos en listados
            res.json(results);
        });
    });

    // ----------------------------------------------------------------
    // RUTA GET (Obtener un usuario específico por ID)
    // ----------------------------------------------------------------
    router.get('/:id_usuario', (req, res) => {
        const { id_usuario } = req.params;
        
        const query = `
            SELECT 
                u.id_usuario, u.nom_1, u.nom_2, u.ape_1, u.ape_2, 
                u.correo, u.telefono, u.id_rol_usuario, u.t_doc, u.img_perfil,
                u.codigo_visible,
                r.nombre_rol, 
                t.desc_doc
            FROM 
                usuario u
            JOIN 
                rol_usuario r ON u.id_rol_usuario = r.id_rol_usuario
            JOIN 
                tipo_documento t ON u.t_doc = t.t_doc
            WHERE 
                u.id_usuario = ?;
        `;

        db.query(query, [id_usuario], (err, results) => {
            if (err) {
                console.error("Error al obtener usuario:", err);
                return res.status(500).send({
                    error: "Error al obtener el usuario.", 
                    details: err.message
                });
            }
            
            if (results.length === 0) {
                return res.status(404).send({ 
                    message: "Usuario no encontrado." 
                });
            }
            
            // NO devolver contraseña ni código por seguridad
            const user = results[0];
            delete user.contrasena;
            delete user.codigo;
            
            res.json(user);
        });
    });

    // ----------------------------------------------------------------
    // RUTA POST (Crear usuario) - CON HASH DE CONTRASEÑA
    // ----------------------------------------------------------------
    router.post('/add', async (req, res) => { 
        const { 
            id_usuario, nom_1, nom_2 = null, ape_1, ape_2 = null, 
            correo, telefono, contrasena, codigo = null, 
            id_rol_usuario, t_doc, img_perfil = null
        } = req.body;

        // Validación básica
        if (!id_usuario || !nom_1 || !ape_1 || !correo || !contrasena || !id_rol_usuario || !t_doc) {
            return res.status(400).send({ 
                error: "Faltan campos obligatorios: id_usuario, nom_1, ape_1, correo, contrasena, id_rol_usuario, t_doc" 
            });
        }

        try {
            //  HASH DE LA CONTRASEÑA
            const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);
            console.log(`Contraseña hasheada para usuario ${id_usuario}`);

            //  HASH DEL CÓDIGO DE ADMINISTRADOR (si existe)
                    let hashedCodigo = null;
                    let codigoVisible = null;
                    
                    if (codigo) {
                        hashedCodigo = await bcrypt.hash(codigo.toString(), SALT_ROUNDS);
                        codigoVisible = codigo.toString(); // ⬅️ GUARDAR CÓDIGO VISIBLE
                        console.log(`Código de admin hasheado para usuario ${id_usuario}`);
                    }

                    const query = `
                        INSERT INTO usuario 
                        (id_usuario, nom_1, nom_2, ape_1, ape_2, correo, telefono, contrasena, codigo, codigo_visible, id_rol_usuario, t_doc, img_perfil) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    
                    const values = [
                        id_usuario, nom_1, nom_2, ape_1, ape_2, correo, telefono, 
                        hashedPassword, hashedCodigo, codigoVisible, id_rol_usuario, t_doc, img_perfil
                    ];

                    db.query(query, values, (err, results) => {
                        if(err){
                            console.error("Error al crear usuario:", err);
                            return res.status(500).send({ error: "Error al crear el usuario.", details: err.sqlMessage });
                        }
                        res.status(201).json({ 
                            message: "Usuario creado exitosamente con contraseña encriptada", 
                            id_usuario 
                        });
                    });

                } catch (error) {
                    console.error("Error al hashear contraseña:", error);
                    return res.status(500).send({ error: "Error al procesar la contraseña.", details: error.message });
                }
            });

    // ----------------------------------------------------------------
    // PUT (Actualizar usuario) - CON SOPORTE PARA CAMBIO DE CONTRASEÑA
    // ----------------------------------------------------------------
    router.put('/update/:id_usuario', async (req, res) => {
        const { id_usuario } = req.params;
        const updateData = req.body;

        let setClauses = [];
        let values = [];

        try {
            for (const key in updateData) {
                if (key === 'id_usuario') continue; // No actualizar ID

                // Si se está actualizando la contraseña, hashearla
                if (key === 'contrasena') {
                    const hashedPassword = await bcrypt.hash(updateData[key], SALT_ROUNDS);
                    setClauses.push(`${key} = ?`);
                    values.push(hashedPassword);
                    console.log(`Nueva contraseña hasheada para usuario ${id_usuario}`);
                }
                // Si se está actualizando el código de admin
                else if (key === 'codigo' && updateData[key]) {
                    const hashedCodigo = await bcrypt.hash(updateData[key].toString(), SALT_ROUNDS);
                    setClauses.push(`codigo = ?`);
                    values.push(hashedCodigo);
                    
                    // TAMBIÉN ACTUALIZAR EL CÓDIGO VISIBLE
                    setClauses.push(`codigo_visible = ?`);
                    values.push(updateData[key].toString());
                    
                    console.log(`Nuevo código de admin hasheado para usuario ${id_usuario}`);
                }
                else {
                    setClauses.push(`${key} = ?`);
                    values.push(updateData[key]);
                }
            }

            if (setClauses.length === 0) {
                return res.status(400).send({ error: "No se proporcionaron campos válidos para actualizar." });
            }

            const query = `UPDATE usuario SET ${setClauses.join(', ')} WHERE id_usuario = ?`;
            values.push(id_usuario);

            db.query(query, values, (err, results) => {
                if(err) {
                    console.error("Error al actualizar usuario:", err);
                    return res.status(500).send({ error: 'Error al actualizar usuario', details: err.sqlMessage });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).send({ message: "Usuario no encontrado o no hubo cambios." });
                }
                res.json({ message: "Usuario actualizado exitosamente", id_usuario });
            });

        } catch (error) {
            console.error("Error al procesar actualización:", error);
            return res.status(500).send({ error: "Error al procesar los datos.", details: error.message });
        }
    });

    // ----------------------------------------------------------------
    // RUTA DELETE (Eliminar usuario)
    // ----------------------------------------------------------------
    router.delete('/delete/:id_usuario', (req, res) => {
        const {id_usuario} = req.params;
        const query = "DELETE FROM usuario WHERE id_usuario = ?";

        db.query(query, [id_usuario], (err, results) => {
            if(err) {
                return res.status(500).send({ error: "Error al eliminar usuario", details: err.sqlMessage });
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ message: "Usuario no encontrado." });
            }
            res.status(204).send();
        });
    });

    // ----------------------------------------------------------------
    // POST (Login/Autenticación) - CON VERIFICACIÓN DE HASH
    // ----------------------------------------------------------------
router.post('/login', async (req, res) => {
    console.log('INICIO DE LOGIN')
    
    const correo = req.body.correo ? req.body.correo.trim() : null;
    const contrasena = req.body.contrasena ? req.body.contrasena : null;
    
    console.log('\nCorreo procesado:', correo);
    console.log(' Contraseña recibida (longitud):', contrasena ? contrasena.length : 0);

    if (!correo || !contrasena) {
        console.log(' Faltan credenciales');
        return res.status(400).send({ message: "Correo y contraseña son requeridos." });
    }

    const query = `
        SELECT 
            u.id_usuario, u.nom_1, u.contrasena, u.correo, u.codigo, 
            r.nombre_rol, u.id_rol_usuario,
            u.img_perfil
        FROM 
            usuario u
        JOIN 
            rol_usuario r ON u.id_rol_usuario = r.id_rol_usuario
        WHERE 
            u.correo = ?;
    `;

    db.query(query, [correo], async (err, results) => {
        if (err) {
            console.error(" Error de base de datos:", err);
            return res.status(500).send({ 
                error: "Error de servidor al consultar usuario.", 
                details: err.sqlMessage 
            });
        }

        console.log('\n Resultado de búsqueda en BD:');
        console.log('   Usuarios encontrados:', results.length);

        if (results.length === 0) {
            console.log(` Usuario NO ENCONTRADO: ${correo}`);
            return res.status(401).send({ message: "Credenciales incorrectas." });
        }

        const user = results[0];
        
        console.log('\n Usuario encontrado en BD:');
        console.log('   ID:', user.id_usuario);
        console.log('   Nombre:', user.nom_1);
        console.log('   Rol ID:', user.id_rol_usuario);
        console.log('   Rol Nombre:', user.nombre_rol);
        console.log('   Tiene código admin:', !!user.codigo);

        if (!user.contrasena) {
            console.error(' El usuario NO tiene contraseña en la BD');
            return res.status(500).send({ 
                message: "Error de configuración de usuario." 
            });
        }

        try {
            console.log('\n  Verificando contraseña...');
            const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
            
            console.log('   Match:', passwordMatch);

            if (!passwordMatch) {
                console.log('\n CONTRASEÑA INCORRECTA');

                return res.status(401).send({ message: "Credenciales incorrectas." });
            }

            console.log(' Contraseña correcta');

            const userData = {
                    id_usuario: user.id_usuario,
                    nom_1: user.nom_1,
                    nom_2: user.nom_2,
                    ape_1: user.ape_1,
                    ape_2: user.ape_2,
                    correo: user.correo,
                    telefono: user.telefono,
                    t_doc: user.t_doc,
                    desc_doc: user.desc_doc,
                    rol: user.nombre_rol, 
                    nombre_rol: user.nombre_rol,
                    id_rol: user.id_rol_usuario,
                    img_perfil: user.img_perfil
            };
            const esAdministrador = user.id_rol_usuario === 1 || 
                                    user.nombre_rol.toLowerCase().includes('admin');
            
            console.log('\n Verificación de rol:');
            console.log('   Es administrador:', esAdministrador);
            console.log('   Tiene código guardado:', !!user.codigo);

            if (esAdministrador && user.codigo) {
                console.log('\n Requiere código de administrador');


                return res.json({ 
                    message: "Requiere código de administrador",
                    needs_code: true, 
                    user: userData
                });
            }

            console.log('\n LOGIN EXITOSO - Sin código admin requerido');

            res.json({ 
                message: "Login exitoso",
                user: userData,
            });

        } catch (error) {
            console.error("\n ERROR EN BCRYPT.COMPARE:", error);
            return res.status(500).send({ 
                error: "Error al verificar credenciales.", 
                details: error.message 
            });
        }
    });
});

    // ----------------------------------------------------------------
    // POST (Verificar código de administrador) 
    // ----------------------------------------------------------------
    router.post('/admin-code', async (req, res) => {

        console.log('VERIFICACIÓN DE CÓDIGO ADMINISTRADOR');
        
        const { id_usuario, codigo } = req.body;
        
        console.log('\nDatos recibidos:');
        console.log('   ID Usuario:', id_usuario);
        console.log('   Código recibido:', codigo ? '***' : 'vacío');

        if (!id_usuario || !codigo) {
            console.log('Faltan datos');
            return res.status(400).json({ 
                success: false, 
                message: "ID de usuario y código son requeridos." 
            });
        }

        const query = `
            SELECT id_usuario, codigo, id_rol_usuario, nom_1, correo 
            FROM usuario 
            WHERE id_usuario = ?
        `;

        db.query(query, [id_usuario], async (err, results) => {
            if (err) {
                console.error("Error de DB:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error interno del servidor." 
                });
            }

            console.log('Resultados BD completos:', JSON.stringify(results, null, 2));

            if (results.length === 0) {
                console.log('Usuario no existe');
                return res.status(404).json({ 
                    success: false, 
                    message: "Usuario no encontrado." 
                });
            }

            const user = results[0];
            
            console.log('   ID:', user.id_usuario);
            console.log('   Nombre:', user.nom_1);
            console.log('   Correo:', user.correo);
            console.log('   Rol ID:', user.id_rol_usuario);
            console.log('   Tipo de Rol ID:', typeof user.id_rol_usuario);
            console.log('   Tiene código:', !!user.codigo);
            console.log('   Código hash:', user.codigo ? user.codigo.substring(0, 30) + '...' : 'NULL');

            // Verificar que sea administrador
            const esAdministrador = user.id_rol_usuario == 1;

            if (!esAdministrador) {
                console.log('NO es administrador según la verificación');
                return res.status(403).json({ 
                    success: false, 
                    message: "Este usuario no es administrador." 
                });
            }
            // Verificar que tenga código almacenado
            if (!user.codigo) {
                console.log(' Usuario no tiene código configurado');
                return res.status(400).json({ 
                    success: false, 
                    message: "El usuario no tiene código configurado." 
                });
            }

            try {
                console.log('\n Comparando códigos...');
                console.log('   Código recibido (hash):', bcrypt.hashSync(codigo.toString(), 10).substring(0, 30) + '...');
                console.log('   Código almacenado (hash):', user.codigo.substring(0, 30) + '...');
                
                const isValid = await bcrypt.compare(codigo.toString(), user.codigo);
                
                console.log('\nResultado de comparación:');
                console.log('   ¿Es válido?:', isValid);

                if (isValid) {
                    console.log('\n CÓDIGO VERIFICADO EXITOSAMENTE');
                    return res.json({ 
                        success: true, 
                        message: "Código verificado correctamente." 
                    });
                } else {
                    console.log('\n CÓDIGO INCORRECTO');
                    return res.status(401).json({ 
                        success: false, 
                        message: "Código incorrecto." 
                    });
                }
                
            } catch (error) {
                console.error(" Error en bcrypt.compare:", error);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error al verificar el código." 
                });
            }
        });
    });


    // ----------------------------------------------------------------
    // POST - Solicitar código de recuperación de contraseña
    // ----------------------------------------------------------------
    router.post('/olvidar-contrasena', async (req, res) => {
        console.log('SOLICITUD DE CÓDIGO DE RECUPERACIÓN');
        
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ message: "El correo es requerido." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ message: "Formato de correo inválido." });
        }

        const query = `SELECT id_usuario, nom_1, correo FROM usuario WHERE correo = ?`;

        db.query(query, [correo], async (err, results) => {
            if (err) {
                console.error(" Error en BD:", err);
                return res.status(500).json({ message: "Error en el servidor." });
            }

            if (results.length === 0) {
                console.log(' Correo no encontrado (no revelamos esto al usuario)');
                return res.json({ 
                    message: "Si el correo existe, recibirás un código de verificación.",
                    success: true  
                });
            }

            const user = results[0];
            
            // Generar código de 6 dígitos
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Guardar el código con expiración de 15 minutos
            verificationCodes.set(correo, {
                code: verificationCode,
                expires: Date.now() + 15 * 60 * 1000,
                userId: user.id_usuario
            });

            console.log(` Código generado para ${correo}: ${verificationCode}`);
            console.log(`Expira en 15 minutos`);

            // Enviar correo
            const mailOptions = {
                from: process.env.EMAIL_USER || 'noreply@tuapp.com',
                to: correo,
                subject: 'Código de Recuperación de Contraseña',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                            .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
                            .code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; letter-spacing: 5px; margin: 20px 0; }
                            .footer { text-align: center; color: #777; font-size: 12px; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Recuperación de Contraseña</h1>
                            </div>
                            <div class="content">
                                <p>Hola <strong>${user.nom_1}</strong>,</p>
                                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                                <p>Tu código de verificación es:</p>
                                <div class="code">${verificationCode}</div>
                                <p><strong>Este código expira en 15 minutos.</strong></p>
                                <p>Si no solicitaste este código, puedes ignorar este correo de forma segura.</p>
                            </div>
                            <div class="footer">
                                <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(` Código enviado a ${correo}`);
                console.log(`Message ID: ${info.messageId}`);
                
                res.json({ 
                    message: "Código de verificación enviado al correo.",
                    success: true 
                });
            } catch (error) {
                console.error("Error al enviar correo:", error);
                console.error("Código de error:", error.code);
                console.error("Detalles:", error.message);
                
                let errorMessage = "Error al enviar el correo.";
                if (error.code === 'EAUTH') {
                    errorMessage = "Error de autenticación. Verifica tus credenciales de Gmail.";
                } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
                    errorMessage = "Error de conexión. Verifica tu conexión a internet.";
                } else if (error.code === 'EENVELOPE') {
                    errorMessage = "Error en la dirección de correo.";
                }
                
                res.status(500).json({ 
                    message: errorMessage,
                    error: error.message 
                });
            }
        });
    });
    // ----------------------------------------------------------------
    // POST - Verificar código y restablecer contraseña
    // ----------------------------------------------------------------
    router.post('/restablecer-contrasena', async (req, res) => {
        console.log(' RESTABLECER CONTRASEÑA');
        const { correo, codigo, nuevaContrasena } = req.body;

        if (!correo || !codigo || !nuevaContrasena) {
            return res.status(400).json({ 
                message: "Correo, código y nueva contraseña son requeridos." 
            });
        }

        const storedData = verificationCodes.get(correo);

        if (!storedData) {
            console.log('Código no encontrado para:', correo);
            return res.status(400).json({ 
                message: "Código inválido o expirado." 
            });
        }

        if (Date.now() > storedData.expires) {
            console.log('Código expirado para:', correo);
            verificationCodes.delete(correo);
            return res.status(400).json({ 
                message: "El código ha expirado. Solicita uno nuevo." 
            });
        }

        if (storedData.code !== codigo) {
            console.log('Código incorrecto para:', correo);
            console.log('Esperado:', storedData.code, 'Recibido:', codigo);
            return res.status(400).json({ 
                message: "Código incorrecto." 
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS);
            const query = `UPDATE usuario SET contrasena = ? WHERE correo = ?`;

            db.query(query, [hashedPassword, correo], (err, results) => {
                if (err) {
                    console.error("Error al actualizar contraseña:", err);
                    return res.status(500).json({ 
                        message: "Error al actualizar la contraseña." 
                    });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ 
                        message: "Usuario no encontrado." 
                    });
                }

                // Eliminar el código usado
                verificationCodes.delete(correo);

                console.log(`Contraseña actualizada para ${correo}`);
                res.json({ 
                    message: "Contraseña actualizada exitosamente.",
                    success: true 
                });
            });

        } catch (error) {
            console.error("Error al hashear contraseña:", error);
            return res.status(500).json({ 
                message: "Error al procesar la contraseña." 
            });
        }
    });

    // ----------------------------------------------------------------
    // POST - Cambiar contraseña (con contraseña anterior)
    // ----------------------------------------------------------------
    router.post('/Cambiar-contrasena', async (req, res) => {
        console.log(' CAMBIAR CONTRASEÑA');
        const { id_usuario, contrasenaActual, nuevaContrasena } = req.body;

        if (!id_usuario || !contrasenaActual || !nuevaContrasena) {
            return res.status(400).json({ 
                message: "ID de usuario, contraseña actual y nueva contraseña son requeridos." 
            });
        }

        const query = `SELECT contrasena FROM usuario WHERE id_usuario = ?`;

        db.query(query, [id_usuario], async (err, results) => {
            if (err) {
                console.error("Error en BD:", err);
                return res.status(500).json({ message: "Error en el servidor." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            const user = results[0];

            try {
                // Verificar contraseña actual
                const passwordMatch = await bcrypt.compare(contrasenaActual, user.contrasena);

                if (!passwordMatch) {
                    return res.status(401).json({ 
                        message: "La contraseña actual es incorrecta." 
                    });
                }

                // Hashear nueva contraseña
                const hashedPassword = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS);
                const updateQuery = `UPDATE usuario SET contrasena = ? WHERE id_usuario = ?`;

                db.query(updateQuery, [hashedPassword, id_usuario], (err, results) => {
                    if (err) {
                        console.error("Error al actualizar contraseña:", err);
                        return res.status(500).json({ 
                            message: "Error al actualizar la contraseña." 
                        });
                    }

                    console.log(`Contraseña cambiada para usuario ${id_usuario}`);
                    res.json({ 
                        message: "Contraseña actualizada exitosamente.",
                        success: true 
                    });
                });

            } catch (error) {
                console.error("Error al procesar contraseña:", error);
                return res.status(500).json({ 
                    message: "Error al procesar la contraseña." 
                });
            }
        });
    });
    return router; 
};