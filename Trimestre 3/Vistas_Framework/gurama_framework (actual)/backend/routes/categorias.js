const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    // GET (READ) todas las categorías
    router.get('/', (req, res) => {
        const query = 'SELECT id_categoria, nombre_c FROM categoria'; 
        
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Error al obtener categorías.", details: err.message });
            }
            res.json(results);
        });
    });
    return router;
};