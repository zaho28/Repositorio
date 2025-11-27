// routes/usuario.js

const express = require('express');
const router = express.Router();

// Exportamos una función que recibe la conexión 'db' como argumento
module.exports = (db) => {

    // ----------------------------------------------------------------
    // RUTA GET (Leer todos los usuarios)
    // ----------------------------------------------------------------
    router.get('/', (req, res) => {
        const query = `
            SELECT 
                u.*, 
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
            res.json(results);
        });
    });

    // ----------------------------------------------------------------
    // RUTA POST (Crear usuario) - Manejo de campos opcionales
    // ----------------------------------------------------------------
    router.post('/add', (req, res) => { 
        // Desestructuración con valores por defecto para campos opcionales (nom_2, ape_2, codigo)
        const { 
            id_usuario, nom_1, nom_2 = null, ape_1, ape_2 = null, 
            correo, telefono, contrasena, codigo = null, 
            id_rol_usuario, t_doc 
        } = req.body;

        const query = `
            INSERT INTO usuario (id_usuario, nom_1, nom_2, ape_1, ape_2, correo, telefono, contrasena, codigo, id_rol_usuario, t_doc) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            id_usuario, nom_1, nom_2, ape_1, ape_2, correo, telefono, 
            contrasena, codigo, id_rol_usuario, t_doc
        ];

        db.query(query, values, (err, results) => {
            if(err){
                return res.status(500).send({ error: "Error al crear el usuario.", details: err.sqlMessage });
            } else {
                res.status(201).json({ message: "Usuario creado exitosamente", id_usuario });
            }
        });
    });

    // ----------------------------------------------------------------
    // RUTA PUT (Actualizar usuario)
    // ----------------------------------------------------------------
    router.put('/update/:id_usuario', (req, res) => {
        const { id_usuario } = req.params;
        const updateData = req.body; // Cuerpo (body) de la petición

        // almacena los vslores para las columnas a actualizar
        let setClauses = []; // ['nombre = ?', 'correo = ?']
        let values = []; // ['Carlos', 'carlos@mail.com']

        for (const key in updateData) {
            // Aseguramos que el ID no se intente cambiar en el SET
            if (key !== 'id_usuario') {
                setClauses.push(`${key} = ?`); // Ej: nom_1 = ?
                values.push(updateData[key]);
            }
        }

        if (setClauses.length === 0) {
            return res.status(400).send({ error: "No se proporcionaron campos válidos para actualizar." });
        }

        // Crear la consulta final y añadir el ID a los valores
        const query = `UPDATE usuario SET ${setClauses.join(', ')} WHERE id_usuario = ?`;
        values.push(id_usuario); 

        db.query(query, values, (err, results) => {
            if(err) {
                return res.status(500).send({ error: 'Error al actualizar usuario', details: err.sqlMessage });
            } else if (results.affectedRows === 0) {
                return res.status(404).send({ message: "Usuario no encontrado o no hubo cambios." });
            } else {
                res.json({ message: "Usuario actualizado", id_usuario });
            }
        });
    });

    // ----------------------------------------------------------------
    // RUTA DELETE (Eliminar usuario)
    // ----------------------------------------------------------------
    router.delete('/delete/:id_usuario', (req, res) => {
        const {id_usuario} = req.params;
        const query = "DELETE FROM usuario WHERE id_usuario = ?";

        db.query(query, [id_usuario], (err, results) => { // Parámetros en array []
            if(err) {
                return res.status(500).send({ error: "Error al eliminar usuario", details: err.sqlMessage });
            } else if (results.affectedRows === 0) {
                return res.status(404).send({ message: "Usuario no encontrado." });
            } else {
                // 204 No Content es la respuesta estándar para un DELETE exitoso
                res.status(204).send(); 
            }
        });
    });

    return router; // Devolver el router configurado para que index.js pueda usarlo
};