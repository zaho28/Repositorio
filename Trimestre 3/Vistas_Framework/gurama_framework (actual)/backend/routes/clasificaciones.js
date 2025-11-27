// routes/clasificaciones.js

const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    router.get('/', (req, res) => {
        const query = 'SELECT id_clasificacion, nombre_clas FROM clasificacion';
        
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).send({ error: "Error al obtener clasificaciones.", details: err.message });
            }
            res.json(results);
        });
    });
    return router;
};