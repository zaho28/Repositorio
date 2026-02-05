const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // =======================================================================
    // POST - CREAR PEDIDO COMPLETO CON TICKET
    // =======================================================================
    router.post('/crear', async (req, res) => {
        const { 
            items,
            id_usuario,
            metodo_pago,
            subtotal,
            total
        } = req.body;

        console.log("Creando pedido completo con ticket");
        console.log("Items recibidos:", JSON.stringify(items, null, 2));

        if (!items || items.length === 0 || !id_usuario || !metodo_pago) {
            return res.status(400).json({ 
                error: "Faltan datos obligatorios (items, id_usuario, metodo_pago)" 
            });
        }

        const fecha_actual = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        try {
            //  Iniciar transacción
            await new Promise((resolve, reject) => {
                db.beginTransaction(err => { 
                    if (err) return reject(err); 
                    resolve(); 
                });
            });

            // 1. Crear el PEDIDO
            const insertPedido = `
                INSERT INTO pedido (fecha, estado, id_usuario, id_tipo) 
                VALUES (?, 'Pagado', ?, 'P-E')
            `;
            
            const pedidoResult = await new Promise((resolve, reject) => {
                db.query(insertPedido, [fecha_actual, id_usuario], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            const id_pedido = pedidoResult.insertId;
            console.log(` Pedido creado: ${id_pedido}`);

            // 2. Procesar cada producto
            const resultados = [];
            const errores = [];

            for (const item of items) {
                const { id_producto, cantidad, precio } = item;
                
                console.log(`\nProcesando producto ${id_producto}, cantidad: ${cantidad}`);
                
                try {
                    //  Verificar stock
                    const verificarStock = `
                        SELECT stock_actual, nom_producto 
                        FROM producto 
                        WHERE id_producto = ? AND estado = 1
                    `;
                    
                    const stockData = await new Promise((resolve, reject) => {
                        db.query(verificarStock, [id_producto], (err, results) => {
                            if (err) return reject(err);
                            resolve(results);
                        });
                    });

                    if (stockData.length === 0) {
                        throw new Error(`Producto ${id_producto} no encontrado`);
                    }

                    const stockActual = stockData[0].stock_actual;
                    const nombreProducto = stockData[0].nom_producto;

                    console.log(`   Stock actual: ${stockActual}`);

                    if (stockActual < cantidad) {
                        throw new Error(`Stock insuficiente para ${nombreProducto}. Disponible: ${stockActual}, Solicitado: ${cantidad}`);
                    }

                    // ACTUALIZAR STOCK (RESTAR CANTIDAD)
                    const actualizarStock = `
                        UPDATE producto 
                        SET stock_actual = stock_actual - ?, ultima_actualiz = ? 
                        WHERE id_producto = ? AND estado = 1
                    `;
                    
                    const updateResult = await new Promise((resolve, reject) => {
                        db.query(actualizarStock, [cantidad, fecha_actual, id_producto], (err, result) => {
                            if (err) {
                                console.error(` Error al actualizar stock:`, err);
                                return reject(err);
                            }
                            
                            if (result.affectedRows === 0) {
                                return reject(new Error(`No se pudo actualizar el stock del producto ${id_producto}`));
                            }
                            
                            console.log(`   Stock actualizado. Nuevo stock: ${stockActual - cantidad}`);
                            resolve(result);
                        });
                    });

                    // Crear detalle del pedido
                    const insertDetalle = `
                        INSERT INTO detalles_pedido (descrip_detalles, cantidad, id_pedido, id_producto) 
                        VALUES (?, ?, ?, ?)
                    `;
                    
                    await new Promise((resolve, reject) => {
                        db.query(insertDetalle, [
                            `${nombreProducto} - $${precio}`,
                            cantidad,
                            id_pedido,
                            id_producto
                        ], (err, result) => {
                            if (err) return reject(err);
                            console.log(`    Detalle de pedido creado`);
                            resolve(result);
                        });
                    });

                    //  Registrar movimiento de salida
                    const insertMovimiento = `
                        INSERT INTO movimiento (Cantidad_m, fecha_m, observaciones, id_m, id_producto, id_usuario) 
                        VALUES (?, ?, ?, 'M-S', ?, ?)
                    `;
                    
                    await new Promise((resolve, reject) => {
                        db.query(insertMovimiento, [
                            cantidad,
                            fecha_actual,
                            `Venta Online - Pedido #${id_pedido}`,
                            id_producto,
                            id_usuario
                        ], (err, result) => {
                            if (err) return reject(err);
                            console.log(`   Movimiento de salida registrado`);
                            resolve(result);
                        });
                    });

                    resultados.push({
                        producto: nombreProducto,
                        cantidad,
                        stock_restante: stockActual - cantidad
                    });

                } catch (itemError) {
                    console.error(` Error con producto ${id_producto}:`, itemError.message);
                    errores.push({
                        producto: id_producto,
                        error: itemError.message
                    });
                    // Si hay error con algún producto, lanzar excepción para hacer rollback
                    throw itemError;
                }
            }

            if (errores.length > 0) {
                throw new Error("Error procesando algunos productos");
            }

            // 3. Crear el TICKET DE COMPRA
            const num_ticket = Math.floor(100000 + Math.random() * 900000);
            
            const insertTicket = `
                INSERT INTO ticket_compra (num_ticket, fecha_emision, sub_total, total_ticket, id_pedido, id_estado, id_met_pago) 
                VALUES (?, ?, ?, ?, ?, 'E-pd', ?)
            `;
            
            const ticketResult = await new Promise((resolve, reject) => {
                db.query(insertTicket, [
                    num_ticket,
                    fecha_actual,
                    subtotal,
                    total,
                    id_pedido,
                    metodo_pago
                ], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            console.log(` Ticket creado: ${num_ticket}`);

            //  COMMIT de la transacción
            await new Promise((resolve, reject) => {
                db.commit(err => { 
                    if (err) {
                        console.error(' Error en commit:', err);
                        return reject(err);
                    }
                    console.log(' Transacción completada exitosamente');
                    resolve(); 
                });
            });

            console.log(" Pedido completo procesado exitosamente");

            res.status(201).json({ 
                success: true,
                message: "Pedido creado con éxito",
                data: {
                    id_pedido,
                    num_ticket,
                    id_ticket: ticketResult.insertId,
                    productos_procesados: resultados.length,
                    detalles: resultados
                }
            });

        } catch (error) {
            console.error(" Error en transacción:", error);
            
            //  ROLLBACK en caso de error
            db.rollback(() => {
                console.log(' Rollback ejecutado');
                res.status(500).json({ 
                    success: false,
                    error: "Error al procesar el pedido",
                    details: error.message
                });
            });
        }
    });

    // =======================================================================
    // GET - OBTENER PEDIDOS DE UN USUARIO
    // =======================================================================
    router.get('/usuario/:id_usuario', (req, res) => {
        const { id_usuario } = req.params;
        
        const query = `
            SELECT 
                p.id_pedido,
                p.fecha,
                p.estado,
                t.num_ticket,
                t.total_ticket,
                t.id_estado,
                e.nom_metodo as estado_pago,
                m.nom_metodo as metodo_pago,
                GROUP_CONCAT(
                    CONCAT(pr.nom_producto, ' (x', dp.cantidad, ')')
                    SEPARATOR ', '
                ) as productos
            FROM pedido p
            LEFT JOIN ticket_compra t ON p.id_pedido = t.id_pedido
            LEFT JOIN estado_pago e ON t.id_estado = e.id_estado
            LEFT JOIN metodo_pago m ON t.id_met_pago = m.id_met_pago
            LEFT JOIN detalles_pedido dp ON p.id_pedido = dp.id_pedido
            LEFT JOIN producto pr ON dp.id_producto = pr.id_producto
            WHERE p.id_usuario = ?
            GROUP BY p.id_pedido, p.fecha, p.estado, t.num_ticket, t.total_ticket, t.id_estado, e.nom_metodo, m.nom_metodo
            ORDER BY p.fecha DESC
        `;
        
        db.query(query, [id_usuario], (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: "Error al obtener pedidos",
                    details: err.message
                });
            }
            res.json(results);
        });
    });

    // =======================================================================
    // GET - OBTENER TODOS LOS PEDIDOS (PARA ADMIN)
    // =======================================================================
    router.get('/todos', (req, res) => {
        const query = `
            SELECT 
                p.id_pedido,
                p.fecha,
                p.estado,
                CONCAT(u.nom_1, ' ', u.ape_1) as cliente,
                u.telefono,
                u.id_usuario,
                t.num_ticket,
                t.total_ticket,
                e.nom_metodo as estado_pago,
                m.nom_metodo as metodo_pago,
                COUNT(DISTINCT dp.id_producto) as total_productos
            FROM pedido p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
            LEFT JOIN ticket_compra t ON p.id_pedido = t.id_pedido
            LEFT JOIN estado_pago e ON t.id_estado = e.id_estado
            LEFT JOIN metodo_pago m ON t.id_met_pago = m.id_met_pago
            LEFT JOIN detalles_pedido dp ON p.id_pedido = dp.id_pedido
            GROUP BY p.id_pedido, p.fecha, p.estado, u.nom_1, u.ape_1, u.telefono, u.id_usuario, t.num_ticket, t.total_ticket, e.nom_metodo, m.nom_metodo
            ORDER BY p.fecha DESC
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: "Error al obtener pedidos",
                    details: err.message
                });
            }
            res.json(results);
        });
    });

    // =======================================================================
    // GET - DETALLE COMPLETO DE UN PEDIDO
    // =======================================================================
    router.get('/detalle/:id_pedido', (req, res) => {
        const { id_pedido } = req.params;
        
        const query = `
            SELECT 
                p.id_pedido,
                p.fecha,
                p.estado,
                CONCAT(u.nom_1, ' ', u.ape_1) as cliente,
                u.correo,
                u.telefono,
                t.num_ticket,
                t.sub_total,
                t.total_ticket,
                e.nom_metodo as estado_pago,
                m.nom_metodo as metodo_pago,
                pr.nom_producto,
                pr.precio_unitario,
                dp.cantidad,
                (pr.precio_unitario * dp.cantidad) as subtotal_producto
            FROM pedido p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
            LEFT JOIN ticket_compra t ON p.id_pedido = t.id_pedido
            LEFT JOIN estado_pago e ON t.id_estado = e.id_estado
            LEFT JOIN metodo_pago m ON t.id_met_pago = m.id_met_pago
            INNER JOIN detalles_pedido dp ON p.id_pedido = dp.id_pedido
            INNER JOIN producto pr ON dp.id_producto = pr.id_producto
            WHERE p.id_pedido = ?
            ORDER BY dp.id_detalles
        `;
        
        db.query(query, [id_pedido], (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: "Error al obtener detalle del pedido",
                    details: err.message
                });
            }
            
            if (results.length === 0) {
                return res.status(404).json({
                    error: "Pedido no encontrado"
                });
            }
            
            res.json(results);
        });
    });

    return router;
};