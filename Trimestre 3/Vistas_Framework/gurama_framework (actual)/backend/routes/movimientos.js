// almacena el historial para los reportes no edita los productos
// no vayan a hacer consultas para igresar productos aqui >:v

const express = require('express');

module.exports = (db) => {
    const router = express.Router(); 

    // ====================================
    // RESUMEN GENERAL (Suma total de entradas y salidas)
    // ====================================
    router.get('/resumen-general', (req, res) => {
        const { desde, hasta } = req.query;
        
        let query = `
            SELECT 
                SUM(CASE WHEN id_m = 'M-E' THEN Cantidad_m ELSE 0 END) as totalEntradas,
                SUM(CASE WHEN id_m = 'M-S' THEN Cantidad_m ELSE 0 END) as totalSalidas
            FROM movimiento
            WHERE 1=1
        `;
        
        const params = [];
        
        if (desde) {
            query += ` AND fecha_m >= ?`;
            params.push(desde);
        }
        if (hasta) {
            query += ` AND fecha_m <= DATE_ADD(?, INTERVAL 1 DAY)`;
            params.push(hasta);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Error en resumen-general:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results[0] || { totalEntradas: 0, totalSalidas: 0 });
        });
    });

    // ====================================
    // MOVIMIENTOS POR DÍA
    // ====================================
    router.get('/por-dia', (req, res) => {
        const { desde, hasta } = req.query;
        
        let query = `
            SELECT 
                DATE_FORMAT(fecha_m, '%Y-%m-%d') as fecha,
                SUM(CASE WHEN id_m = 'M-E' THEN Cantidad_m ELSE 0 END) as entradas,
                SUM(CASE WHEN id_m = 'M-S' THEN Cantidad_m ELSE 0 END) as salidas
            FROM movimiento
            WHERE 1=1
        `;
        
        const params = [];
        
        if (desde) {
            query += ` AND fecha_m >= ?`;
            params.push(desde);
        }
        if (hasta) {
            query += ` AND fecha_m <= DATE_ADD(?, INTERVAL 1 DAY)`;
            params.push(hasta);
        }
        
        query += ` GROUP BY DATE_FORMAT(fecha_m, '%Y-%m-%d') ORDER BY fecha`;

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Error en por-dia:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    });

    // ====================================
    // MOVIMIENTOS POR TIPO (Gráfico circular)
    // ====================================
    router.get('/por-tipo', (req, res) => {
        const { desde, hasta } = req.query;
        
        let query = `
            SELECT 
                CASE 
                    WHEN id_m = 'M-E' THEN 'Entrada'
                    WHEN id_m = 'M-S' THEN 'Salida'
                END as tipo,
                COUNT(*) as cantidad,
                SUM(Cantidad_m) as total_unidades
            FROM movimiento
            WHERE 1=1
        `;
        
        const params = [];
        
        if (desde) {
            query += ` AND fecha_m >= ?`;
            params.push(desde);
        }
        if (hasta) {
            query += ` AND fecha_m <= DATE_ADD(?, INTERVAL 1 DAY)`;
            params.push(hasta);
        }
        
        query += ` GROUP BY id_m`;

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Error en por-tipo:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    });

    // ====================================
    // TOP PRODUCTOS MÁS MOVIDOS (Gráfico de barras)
    // ====================================
    router.get('/top-productos', (req, res) => {
        const { desde, hasta, limit = 10 } = req.query;
        
        let query = `
            SELECT 
                p.id_producto,
                p.nom_producto as producto,
                p.stock_actual,
                p.stock_minimo,
                COUNT(m.id_movimiento) as total_movimientos,
                SUM(CASE WHEN m.id_m = 'M-E' THEN m.Cantidad_m ELSE 0 END) as entradas,
                SUM(CASE WHEN m.id_m = 'M-S' THEN m.Cantidad_m ELSE 0 END) as salidas
            FROM producto p
            LEFT JOIN movimiento m ON p.id_producto = m.id_producto
            WHERE p.estado = 1
        `;
        
        const params = [];
        
        if (desde) {
            query += ` AND m.fecha_m >= ?`;
            params.push(desde);
        }
        if (hasta) {
            query += ` AND m.fecha_m <= DATE_ADD(?, INTERVAL 1 DAY)`;
            params.push(hasta);
        }
        
        query += `
            GROUP BY p.id_producto, p.nom_producto, p.stock_actual, p.stock_minimo
            ORDER BY total_movimientos DESC
            LIMIT ?
        `;
        params.push(parseInt(limit));

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Error en top-productos:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    });

    // ====================================
    // RESUMEN MENSUAL (Últimos 12 meses)
    // ====================================
    router.get('/resumen-mensual', (req, res) => {
        const query = `
            SELECT 
                DATE_FORMAT(fecha_m, '%Y-%m') as mes,
                DATE_FORMAT(fecha_m, '%b %Y') as mes_nombre,
                SUM(CASE WHEN id_m = 'M-E' THEN Cantidad_m ELSE 0 END) as entradas,
                SUM(CASE WHEN id_m = 'M-S' THEN Cantidad_m ELSE 0 END) as salidas
            FROM movimiento
            WHERE fecha_m >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(fecha_m, '%Y-%m')
            ORDER BY mes
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error("Error en resumen-mensual:", err);
                return res.status(500).json({ error: err.message });
            }
            const formattedResults = results.map(row => ({
                mes: row.mes_nombre,
                entradas: row.entradas,
                salidas: row.salidas
            }));
            res.json(formattedResults);
        });
    });

    // ====================================
    // TODOS LOS MOVIMIENTOS REALIZADOS
    // ====================================
    router.get('/', (req, res) => {
        const { desde, hasta, tipo, producto, limit = 100 } = req.query;
        
        let query = `
            SELECT 
                m.*,
                p.nom_producto,
                u.Nombre_u as usuario_nombre,
                CASE 
                    WHEN m.id_m = 'M-E' THEN 'Entrada'
                    WHEN m.id_m = 'M-S' THEN 'Salida'
                END as tipo_movimiento
            FROM movimiento m
            LEFT JOIN producto p ON m.id_producto = p.id_producto
            LEFT JOIN usuario u ON m.id_usuario = u.id_usuario
            WHERE 1=1
        `;
        
        const params = [];
        
        if (desde) {
            query += ` AND m.fecha_m >= ?`;
            params.push(desde);
        }
        if (hasta) {
            query += ` AND m.fecha_m <= DATE_ADD(?, INTERVAL 1 DAY)`;
            params.push(hasta);
        }
        if (tipo) {
            query += ` AND m.id_m = ?`;
            params.push(tipo);
        }
        if (producto) {
            query += ` AND m.id_producto = ?`;
            params.push(producto);
        }
        
        query += ` ORDER BY m.fecha_m DESC LIMIT ?`;
        params.push(parseInt(limit));

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Error en movimientos:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    });

    return router;
};