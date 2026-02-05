const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // =======================================================================
    // GET - OBTENER TODAS LAS NOTIFICACIONES ACTIVAS
    // =======================================================================
    router.get('/', (req, res) => {
        const query = `
            SELECT 
                'stock-bajo' as tipo,
                CONCAT('stock-bajo-', p.id_producto) as id_notificacion,
                p.id_producto,
                p.nom_producto,
                p.stock_actual,
                p.stock_minimo,
                p.ultima_actualiz as fecha,
                'Alerta de bajo stock' as mensaje,
                CONCAT(p.nom_producto, ' - Últimas ', p.stock_actual, ' unidades') as detalles,
                '/movimientos' as ruta_destino,
                'stock' as clase_boton
            FROM producto p
            WHERE p.estado = 1 
            AND p.stock_actual <= p.stock_minimo
            AND p.stock_actual > 0

            UNION ALL

            SELECT 
                'agotado' as tipo,
                CONCAT('agotado-', p.id_producto) as id_notificacion,
                p.id_producto,
                p.nom_producto,
                p.stock_actual,
                p.stock_minimo,
                p.ultima_actualiz as fecha,
                'Producto agotado' as mensaje,
                CONCAT(p.nom_producto, ' - SIN STOCK DISPONIBLE') as detalles,
                '/movimientos' as ruta_destino,
                'agotado' as clase_boton
            FROM producto p
            WHERE p.estado = 1 
            AND p.stock_actual = 0

            UNION ALL

            SELECT 
                'pedido' as tipo,
                CONCAT('pedido-', p.id_pedido) as id_notificacion,
                p.id_pedido as id_producto,
                CONCAT(u.nom_1, ' ', u.ape_1) as nom_producto,
                NULL as stock_actual,
                NULL as stock_minimo,
                p.fecha as fecha,
                'Se agregó nuevo pedido' as mensaje,
                CONCAT(
                    'Id_pedido: ', COALESCE(t.num_ticket, p.id_pedido), 
                    ' - Cliente: ', u.nom_1, ' ', u.ape_1,
                    ' - ', 
                    CASE 
                        WHEN p.id_tipo = 'P-P' THEN 'Personalizado'
                        ELSE 'Estándar'
                    END
                ) as detalles,
                '/pedidos_realizados' as ruta_destino,
                'pedido' as clase_boton
            FROM pedido p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
            LEFT JOIN ticket_compra t ON p.id_pedido = t.id_pedido
            WHERE p.fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY fecha DESC
            LIMIT 100
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener notificaciones:', err);
                return res.status(500).json({
                    error: "Error al obtener notificaciones",
                    details: err.message
                });
            }
            res.json(results);
        });
    });

    // =======================================================================
    // GET - CONTAR NOTIFICACIONES NO LEÍDAS
    // =======================================================================
    router.get('/count', (req, res) => {
        const query = `
            SELECT 
                (SELECT COUNT(*) 
                 FROM producto 
                 WHERE estado = 1 
                 AND stock_actual <= stock_minimo 
                 AND stock_actual > 0) as alertas_stock_bajo,
                
                (SELECT COUNT(*) 
                 FROM producto 
                 WHERE estado = 1 
                 AND stock_actual = 0) as alertas_agotados,
                
                (SELECT COUNT(*) 
                 FROM pedido 
                 WHERE fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as nuevos_pedidos,
                
                (SELECT COUNT(*) 
                 FROM producto 
                 WHERE estado = 1 
                 AND stock_actual <= stock_minimo) + 
                (SELECT COUNT(*) 
                 FROM pedido 
                 WHERE fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as total_notificaciones
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al contar notificaciones:', err);
                return res.status(500).json({
                    error: "Error al contar notificaciones",
                    details: err.message
                });
            }
            res.json(results[0]);
        });
    });

    // =======================================================================
    // GET - OBTENER SOLO ALERTAS DE STOCK BAJO
    // =======================================================================
    router.get('/stock-bajo', (req, res) => {
        const query = `
            SELECT 
                p.id_producto,
                p.nom_producto,
                p.stock_actual,
                p.stock_minimo,
                p.ultima_actualiz,
                c.nombre_c as categoria,
                p.ruta_imagen
            FROM producto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.estado = 1 
            AND p.stock_actual <= p.stock_minimo
            AND p.stock_actual > 0
            ORDER BY p.stock_actual ASC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener productos con stock bajo:', err);
                return res.status(500).json({
                    error: "Error al obtener productos con stock bajo",
                    details: err.message
                });
            }
            res.json(results);
        });
    });

    // =======================================================================
    // GET - OBTENER SOLO PRODUCTOS AGOTADOS
    // =======================================================================
    router.get('/agotados', (req, res) => {
        const query = `
            SELECT 
                p.id_producto,
                p.nom_producto,
                p.stock_actual,
                p.stock_minimo,
                p.ultima_actualiz,
                c.nombre_c as categoria,
                p.ruta_imagen
            FROM producto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE p.estado = 1 
            AND p.stock_actual = 0
            ORDER BY p.ultima_actualiz DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener productos agotados:', err);
                return res.status(500).json({
                    error: "Error al obtener productos agotados",
                    details: err.message
                });
            }
            res.json(results);
        });
    });

    // =======================================================================
    // GET - OBTENER SOLO PEDIDOS RECIENTES
    // =======================================================================
    router.get('/pedidos-recientes', (req, res) => {
        const { dias = 7 } = req.query;
        
        const query = `
            SELECT 
                p.id_pedido,
                p.fecha,
                p.estado,
                p.id_tipo,
                CONCAT(u.nom_1, ' ', u.ape_1) as cliente,
                u.telefono,
                u.correo,
                t.num_ticket,
                t.total_ticket,
                tp.desc_tipo as tipo_pedido,
                COUNT(DISTINCT dp.id_producto) as total_productos
            FROM pedido p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
            LEFT JOIN ticket_compra t ON p.id_pedido = t.id_pedido
            LEFT JOIN tipo_pedido tp ON p.id_tipo = tp.id_tipo
            LEFT JOIN detalles_pedido dp ON p.id_pedido = dp.id_pedido
            WHERE p.fecha >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY p.id_pedido, p.fecha, p.estado, p.id_tipo, 
                     u.nom_1, u.ape_1, u.telefono, u.correo, 
                     t.num_ticket, t.total_ticket, tp.desc_tipo
            ORDER BY p.fecha DESC
        `;

        db.query(query, [parseInt(dias)], (err, results) => {
            if (err) {
                console.error('Error al obtener pedidos recientes:', err);
                return res.status(500).json({
                    error: "Error al obtener pedidos recientes",
                    details: err.message
                });
            }
            res.json(results);
        });
    });

    // =======================================================================
    // GET - ESTADÍSTICAS DE NOTIFICACIONES
    // =======================================================================
    router.get('/estadisticas', (req, res) => {
        const query = `
            SELECT 
                (SELECT COUNT(*) 
                 FROM producto 
                 WHERE estado = 1 
                 AND stock_actual = 0) as productos_agotados,
                
                (SELECT COUNT(*) 
                 FROM producto 
                 WHERE estado = 1 
                 AND stock_actual <= stock_minimo 
                 AND stock_actual > 0) as productos_stock_bajo,
                
                (SELECT COUNT(*) 
                 FROM pedido 
                 WHERE DATE(fecha) = CURDATE()) as pedidos_hoy,
                
                (SELECT COUNT(*) 
                 FROM pedido 
                 WHERE fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as pedidos_semana,
                
                (SELECT COUNT(*) 
                 FROM pedido 
                 WHERE estado = 'Pendiente') as pedidos_pendientes
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener estadísticas:', err);
                return res.status(500).json({
                    error: "Error al obtener estadísticas",
                    details: err.message
                });
            }
            res.json(results[0]);
        });
    });

    return router;
};