const express = require('express');
const multer = require('multer');

// ===================================
// CONFIGURACIÓN DE MULTER (Uploads)
// ===================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/productos'); 
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
    //  GET (READ) todos los producs
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

        const cantidad = parseInt(cantidad_m);

        const cleanVal = (val) => (val === '' || val === undefined) ? null : val;

        const clean_stock_minimo = cleanVal(stock_minimo);
        const clean_color = cleanVal(color);
        const clean_talla = cleanVal(talla);
        const clean_tamano = cleanVal(tamaño);
        const clean_descripcion = cleanVal(descripcion);
        const clean_id_clasificacion = cleanVal(id_clasificacion);
        
        // El id_usuario y id_categoria son obligatorios, no se limpian a null.
        
        const ultima_actualiz = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let producto_id = id_producto_existente; // Se usará si no es nuevo

        try {
            await new Promise((resolve, reject) => {
                db.beginTransaction(err => { if (err) return reject(err); resolve(); });
            });

            if (es_nuevo_producto === 'true') {
                // (Lógica de INSERT INTO producto) 
                if (!nom_producto || !precio_unitario || !id_categoria || !cantidad_m || !id_usuario) {
                    throw new Error("Faltan campos obligatorios (nombre, precio, categoría, cantidad, usuario) para el nuevo producto.");
                }
                const ruta_imagen = req.file ? req.file.path.replace(/\\/g, '/') : null;
                const insertProductQuery = ` INSERT INTO producto (nom_producto, precio_unitario, stock_actual, stock_minimo, ultima_actualiz, color, talla, tamaño, descripcion, id_categoria, id_clasificacion, ruta_imagen) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
                
                const productValues = [
                    nom_producto, 
                    parseFloat(precio_unitario), // Usar parseFloat
                    cantidad, 
                    parseInt(clean_stock_minimo), 
                    ultima_actualiz, 
                    clean_color, 
                    clean_talla, 
                    clean_tamano, 
                    clean_descripcion, 
                    parseInt(id_categoria), 
                    parseInt(clean_id_clasificacion), 
                    ruta_imagen
                ];

                const productResult = await new Promise((resolve, reject) => {
                    db.query(insertProductQuery, productValues, (err, result) => { 
                        if (err) return reject(err); 
                        resolve(result); 
                    });
                });
                producto_id = productResult.insertId;

            } else {
                // (Lógica de UPDATE producto SET stock_actual)
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

            // (Lógica de INSERT INTO movimiento)
            const insertMovementQuery = ` INSERT INTO movimiento (Cantidad_m, fecha_m, observaciones, id_m, id_producto, id_usuario) VALUES (?, ?, ?, 'M-E', ?, ?) `;
            const movementValues = [cantidad, ultima_actualiz, cleanVal(observaciones), producto_id, id_usuario];
            await new Promise((resolve, reject) => {
                db.query(insertMovementQuery, movementValues, (err, result) => { 
                    if (err) return reject(err); 
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


    return router;
};