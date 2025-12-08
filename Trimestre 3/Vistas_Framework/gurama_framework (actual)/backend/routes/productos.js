const express = require('express');
const multer = require('multer');

// ===================================
// CONFIGURACIÓN DE MULTER (assets)
// ===================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/productos'); 
    },
    filename: (req, file, cb) => {
        cb(null, 'producto-' + Date.now() + '-' + file.originalname);
    }
});
// Inicializa la instancia de upload con la configuración de almacenamiento
const upload = multer({ storage: storage }); 

// La función que exporta y recibe la conexión 'db'
module.exports = (db) => { 
        const router = express.Router(); 

    // ====================================
    // GET (READ) todos los producs
    // ====================================
    router.get('/', (req, res) => {
        const query = `
            SELECT 
            pr.*, 
            c.nombre_c AS nombre_c, 
            cl.nombre_clas AS nombre_clas 
            FROM 
            producto pr
            JOIN categoria c ON pr.id_categoria = c.id_categoria 
            JOIN clasificacion cl ON pr.id_clasificacion = cl.id_clasificacion
            WHERE pr.estado = 1 -- Solo productos activos
        `;
        
        db.query(query, (err, results) => {
            if(err){
                return res.status(500).send({error: "Error al obtener productos.", details: err.message});
            }
            res.json(results);
        });
    });

    // =======================================================================
    // POST (CREATE) REGISTRO DE ENTRADA (Maneja Nuevo Producto o Stock)
    // =======================================================================

router.post('/inventario', upload.single('imagen_producto'), async (req, res) => {
    
    const { 
        // Datos
        id_usuario, cantidad_m, observaciones, es_nuevo_producto, id_producto_existente, 
        // Datos solo para productos nuevos
        nom_producto, precio_unitario, stock_minimo, color, talla, tamaño, descripcion, id_categoria, id_clasificacion 
    } = req.body;

    //const id_usuario_forzado = 'Adm-01';
    const idUsuarioMovimiento = id_usuario; 
    if (!idUsuarioMovimiento) {
        return res.status(401).send({ message: "Se requiere un ID de usuario para registrar el movimiento." });
    }

    const cantidad = parseInt(cantidad_m);

    const cleanVal = (val) => (val === '' || val === undefined) ? null : val;

    const clean_color = cleanVal(color);
    const clean_talla = cleanVal(talla);
    const clean_tamano = cleanVal(tamaño);
    
    const ultima_actualiz = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let producto_id = id_producto_existente; 

    try {
        await new Promise((resolve, reject) => {
            db.beginTransaction(err => { if (err) return reject(err); resolve(); });
        });

        if (es_nuevo_producto === 'true') {

            if (!nom_producto || !precio_unitario || !id_categoria || !id_clasificacion || !cantidad_m || !id_usuario || !descripcion || !stock_minimo) {
                throw new Error("Faltan campos obligatorios para el nuevo producto.");
            }

            let ruta_imagen_publica = null;
            if (req.file) {
                const filename = req.file.filename;
                ruta_imagen_publica = `/assets/productos/${filename}`;
            }

            const insertProductQuery = ` INSERT INTO producto (nom_producto, precio_unitario, stock_actual, stock_minimo, ultima_actualiz, color, talla, tamaño, descripcion, id_categoria, id_clasificacion, ruta_imagen, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1) `;

            const productValues = [
                nom_producto, 
                parseFloat(precio_unitario),
                cantidad, 
                parseInt(stock_minimo), 
                ultima_actualiz, 
                clean_color, 
                clean_talla, 
                clean_tamano, 
                descripcion, 
                parseInt(id_categoria), 
                parseInt(id_clasificacion), 
                ruta_imagen_publica
            ];

            const productResult = await new Promise((resolve, reject) => {
                db.query(insertProductQuery, productValues, (err, result) => { 
                    if (err) return reject(err); 
                    resolve(result); 
                });
            });
            producto_id = productResult.insertId;

        } else {
            // ... (Lógica de UPDATE de stock) ...
            if (!id_producto_existente || !cantidad_m || !id_usuario) { 
                throw new Error("Faltan campos obligatorios (ID producto, cantidad, usuario) para la entrada de stock."); 
            }
            const updateStockQuery = ` UPDATE producto SET stock_actual = stock_actual + ?, ultima_actualiz = ? WHERE id_producto = ? `;
            await new Promise((resolve, reject) => {
                db.query(updateStockQuery, [cantidad, ultima_actualiz, producto_id], (err, result) => { 
                    if (err) return reject(err); 
                    resolve(result); 
                });
            });
        }

        const insertMovementQuery = ` 
            INSERT INTO movimiento (Cantidad_m, fecha_m, observaciones, id_m, id_producto, id_usuario) 
            VALUES (?, ?, ?, ?, ?, ?) 
        `;
        const movementValues = [
            cantidad, 
            ultima_actualiz, 
            cleanVal(observaciones), 
            'M-E',          // <-- Valor  'Entrada'
            producto_id, 
            idUsuarioMovimiento
            //id_usuario_forzado      // <-- Valor 'Adm-01' (VARCHAR)
        ];
        
        await new Promise((resolve, reject) => {
            db.query(insertMovementQuery, movementValues, (err, result) => { 
                if (err) return reject(err); 
                console.log("Movimiento de entrada registrado: ", result.insertId);
                resolve(result); 
            });
        });

        // Commit
        await new Promise((resolve, reject) => { db.commit(err => { if (err) return reject(err); resolve(); }); });

        res.status(201).json({ message: "Entrada de inventario registrada con éxito.", id_producto: producto_id });

    } catch (error) {
        console.error("Error en la transacción de inventario:", error);
        db.rollback(() => { 
            res.status(500).send({ 
                error: "Error en la transacción.", 
                details: error.message, 
                sql_error: error.sqlMessage || "No se pudo completar la operación." 
            }); 
        });
    }
});

    // =======================================================================
    // CHECK (Validar ID para entrada de stock)
    // =======================================================================
    router.get('/check/:id', (req, res) => {
        const { id } = req.params;
        
        const query = `
            SELECT id_producto, nom_producto, stock_actual 
            FROM producto 
            WHERE id_producto = ? AND estado = 1
        `;

        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Error de servidor", details: err.message });
            }
            if (results.length > 0) {
                // Producto encontrado
                res.json({ found: true, product: results[0] });
            } else {
                // Producto no existe o está inactivo
                res.status(404).json({ found: false, message: "Producto no encontrado" });
            }
        });
    });

    // =======================================================================
    // POST (CREATE) REGISTRO DE ENTRADA (Nuevo Producto o +Stock)
    // =======================================================================
    router.post('/inventario', upload.single('imagen_producto'), async (req, res) => {
        
        const { 
            id_usuario, cantidad_m, observaciones, es_nuevo_producto, id_producto_existente, 
            nom_producto, precio_unitario, stock_minimo, color, talla, tamaño, descripcion, id_categoria, id_clasificacion 
        } = req.body;

        const idUsuarioMovimiento = id_usuario; 
        if (!idUsuarioMovimiento) {
            return res.status(401).send({ message: "Se requiere un ID de usuario." });
        }

    // Función para convertir valores vacíos a NULL temporalmente
    const cleanVal = (val) => (val === '' || val === undefined || val === null) ? null : val;
    
    const clean_color = cleanVal(color);
    const clean_talla = cleanVal(talla);
    const clean_tamano = cleanVal(tamaño);
    
    // Si no hay clasificación
    const clasificacion_final = id_clasificacion && id_clasificacion !== '' && id_clasificacion !== 'null'
        ? parseInt(id_clasificacion) 
        : 1; // Por defecto: "Sin clasificar"
    
    const ultima_actualiz = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let producto_id = id_producto_existente;

        try {
            // Iniciar Transacción
            await new Promise((resolve, reject) => {
                db.beginTransaction(err => { if (err) return reject(err); resolve(); });
            });

            // --- NUEVO PRODUCTO ---
            if (es_nuevo_producto === 'true') {

                if (!nom_producto || !precio_unitario || !id_categoria || !cantidad_m || !descripcion || !stock_minimo) {
                    throw new Error("Faltan campos obligatorios para el nuevo producto.");
                }

                let ruta_imagen_publica = null;
                if (req.file) {
                    ruta_imagen_publica = `/assets/productos/${req.file.filename}`;
                }

            const insertProductQuery = ` 
                INSERT INTO producto (
                    nom_producto, precio_unitario, stock_actual, stock_minimo, ultima_actualiz, color, talla, tamaño, descripcion, id_categoria, id_clasificacion, ruta_imagen, estado
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1) 
            `;

                const productValues = [
                    nom_producto, 
                    parseFloat(precio_unitario),
                    cantidad, 
                    parseInt(stock_minimo), 
                    ultima_actualiz, 
                    clean_color, 
                    clean_talla, 
                    clean_tamano, 
                    descripcion, 
                    parseInt(id_categoria), 
                    clasificacion_final, // Siempre tiene valor (nunca NULL)
                    ruta_imagen_publica
                ];

                const productResult = await new Promise((resolve, reject) => {
                    db.query(insertProductQuery, productValues, (err, result) => { 
                        if (err) return reject(err); 
                        resolve(result); 
                    });
                });
                producto_id = productResult.insertId;

            // --- AUMENTAR STOCK EXISTENTE ---
            } else {
                
                if (!id_producto_existente || !cantidad_m) { 
                    throw new Error("Falta el ID del producto o la cantidad."); 
                }

                // stock_actual = stock_actual + (la nueva cantidad)?
                const updateStockQuery = ` 
                    UPDATE producto 
                    SET stock_actual = stock_actual + ?, ultima_actualiz = ? 
                    WHERE id_producto = ? 
                `;
                
                await new Promise((resolve, reject) => {
                    db.query(updateStockQuery, [cantidad, ultima_actualiz, producto_id], (err, result) => { 
                        if (err) return reject(err); 
                        resolve(result); 
                    });
                });
            }

            // --- REGISTRAR EN HISTORIAL (MOVIMIENTO) ---
            const insertMovementQuery = ` 
                INSERT INTO movimiento (Cantidad_m, fecha_m, observaciones, id_m, id_producto, id_usuario) 
                VALUES (?, ?, ?, ?, ?, ?) 
            `;
            const movementValues = [
                cantidad, ultima_actualiz, cleanVal(observaciones), 'M-E', producto_id, idUsuarioMovimiento
            ];
            
            await new Promise((resolve, reject) => {
                db.query(insertMovementQuery, movementValues, (err, result) => { 
                    if (err) return reject(err); 
                    resolve(result); 
                });
            });

            // Confirmar Transacción
            await new Promise((resolve, reject) => { 
                db.commit(err => { if (err) return reject(err); resolve(); }); 
            });

            res.status(201).json({ message: "Entrada registrada con éxito.", id_producto: producto_id });

        } catch (error) {
            console.error("Error en transacción:", error);
            db.rollback(() => { 
                res.status(500).send({ error: "Error en la transacción.", details: error.message }); 
            });
        }
    });

    // ====================================
    // GET (READ) un producto específico por ID
    // ====================================
    router.get('/:id', (req, res) => {
        const { id } = req.params;
        
        const query = `
            SELECT 
                pr.*, 
                c.nombre_c AS nombre_c, 
                cl.nombre_clas AS nombre_clas 
            FROM 
                producto pr
            JOIN categoria c ON pr.id_categoria = c.id_categoria 
            JOIN clasificacion cl ON pr.id_clasificacion = cl.id_clasificacion
            WHERE pr.id_producto = ? AND pr.estado = 1
        `;
        
        db.query(query, [id], (err, results) => {
            if(err){
                return res.status(500).send({
                    error: "Error al obtener producto.", 
                    details: err.message
                });
            }
            
            if(results.length === 0){
                return res.status(404).send({
                    error: "Producto no encontrado."
                });
            }
            
            res.json(results[0]);
        });
    });

    // ====================================
    // PUT (UPDATE) actualizar producto
    // ====================================
    router.put('/:id', upload.single('imagen_producto'), async (req, res) => {
        const { id } = req.params;
        
        console.log(" PETICIÓN DE ACTUALIZACIÓN RECIBIDA");
        console.log("=".repeat(60));
        console.log(" ID Producto:", id);
        console.log("Imagen nueva:", req.file ? req.file.filename : "Sin cambio");

        const {
            nom_producto,
            precio_unitario,
            stock_actual,
            stock_minimo,
            color,
            talla,
            tamaño,
            descripcion,
            id_categoria,
            id_clasificacion,
            id_usuario
        } = req.body;

        // Función helper para limpiar valores vacíos
        const cleanVal = (val) => (val === '' || val === undefined) ? null : val;

        try {
            // Construir la query dinámicamente
            let updateFields = [];
            let updateValues = [];

            if (nom_producto) {
                updateFields.push('nom_producto = ?');
                updateValues.push(nom_producto);
            }
            if (precio_unitario) {
                updateFields.push('precio_unitario = ?');
                updateValues.push(parseFloat(precio_unitario));
            }
            if (stock_actual !== undefined && stock_actual !== '') {
                updateFields.push('stock_actual = ?');
                updateValues.push(parseInt(stock_actual));
            }
            if (stock_minimo !== undefined && stock_minimo !== '') {
                updateFields.push('stock_minimo = ?');
                updateValues.push(parseInt(stock_minimo));
            }
            if (color !== undefined) {
                updateFields.push('color = ?');
                updateValues.push(cleanVal(color));
            }
            if (talla !== undefined) {
                updateFields.push('talla = ?');
                updateValues.push(cleanVal(talla));
            }
            if (tamaño !== undefined) {
                updateFields.push('tamaño = ?');
                updateValues.push(cleanVal(tamaño));
            }
            if (descripcion !== undefined) {
                updateFields.push('descripcion = ?');
                updateValues.push(cleanVal(descripcion));
            }
            if (id_categoria) {
                updateFields.push('id_categoria = ?');
                updateValues.push(parseInt(id_categoria));
            }
            if (id_categoria !== undefined) {
                updateFields.push('id_categoria = ?');
                updateValues.push(parseInt(id_categoria));
            }

            // Clasificación: si está vacío, usar 1 (Sin clasificar)
            if (id_clasificacion !== undefined) {
                updateFields.push('id_clasificacion = ?');
                const clasificacion_final = id_clasificacion && id_clasificacion !== '' && id_clasificacion !== 'null'
                    ? parseInt(id_clasificacion)
                    : 1; // Por defecto: "Sin clasificar"
                updateValues.push(clasificacion_final);
            }

            // Si hay una nueva imagen
            if (req.file) {
                const ruta_imagen_publica = `/assets/productos/${req.file.filename}`;
                updateFields.push('ruta_imagen = ?');
                updateValues.push(ruta_imagen_publica);
            }

            // Actualizar fecha
            const ultima_actualiz = new Date().toISOString().slice(0, 19).replace('T', ' ');
            updateFields.push('ultima_actualiz = ?');
            updateValues.push(ultima_actualiz);

            // Agregar el ID al final para el WHERE
            updateValues.push(id);


            if (updateFields.length === 0) {
                return res.status(400).send({
                    error: "No se proporcionaron campos para actualizar."
                });
            }

            const updateQuery = `
                UPDATE producto 
                SET ${updateFields.join(', ')}
                WHERE id_producto = ? AND estado = 1
            `;

            console.log(" Query:", updateQuery);
            console.log(" Values:", updateValues);

            db.query(updateQuery, updateValues, (err, result) => {
                if (err) {
                    console.error(" Error en UPDATE:", err);
                    return res.status(500).send({
                        error: "Error al actualizar producto.",
                        details: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).send({
                        error: "Producto no encontrado o ya eliminado."
                    });
                }

                console.log(" Producto actualizado correctamente");
                
                res.json({
                    message: "Producto actualizado con éxito.",
                    id_producto: id,
                    cambios_realizados: result.changedRows
                });
            });

        } catch (error) {
            console.error(" Error en actualización:", error);
            res.status(500).send({
                error: "Error en el proceso de actualización.",
                details: error.message
            });
        }
    });

    // ====================================
    // Obtener todas las clasificaciones
    // ====================================
    router.get('/clasificaciones/todas', (req, res) => {
        const query = 'SELECT * FROM clasificacion ORDER BY id_clasificacion';
        
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).send({
                    error: "Error al obtener clasificaciones.",
                    details: err.message
                });
            }
            res.json(results);
        });
    });

    // ====================================
    // DELETE (Eliminación lógica - cambia estado a 0)
    // ====================================
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        
        console.log(" PETICIÓN DE ELIMINACIÓN RECIBIDA");
        console.log("=".repeat(60));
        console.log(" ID Producto:", id);

        // Eliminación lógica: cambiar estado a 0 en lugar de borrar el registro
        const deleteQuery = `
            UPDATE producto 
            SET estado = 0, ultima_actualiz = NOW()
            WHERE id_producto = ? AND estado = 1
        `;

        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error(" Error en DELETE:", err);
                return res.status(500).send({
                    error: "Error al eliminar producto.",
                    details: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({
                    error: "Producto no encontrado o ya fue eliminado."
                });
            }

            console.log("Producto eliminado correctamente (estado = 0)");
            
            res.json({
                message: "Producto eliminado con éxito.",
                id_producto: id
            });
        });
    });

    return router;
};