const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importamos la conexión que acabas de crear

// Definimos cómo se va a ver la tabla "Cliente" en SQLite
const Cliente = sequelize.define('Cliente', {
  id_usuario: { 
    type: DataTypes.STRING, 
    primaryKey: true // Este es el identificador único (la llave primaria)
  },
  nom_1: { 
    type: DataTypes.STRING, 
    allowNull: false // allowNull: false significa que es obligatorio
  },
  nom_2: { 
    type: DataTypes.STRING, 
    allowNull: true // allowNull: true significa que puede ir vacío
  },
  ape_1: { type: DataTypes.STRING, allowNull: false },
  ape_2: { 
    type: DataTypes.STRING, 
    allowNull: true // allowNull: true significa que puede ir vacío
  },
  correo: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true // Asegura que no se repitan correos
  },
  telefono: { type: DataTypes.STRING, allowNull: false },
  contrasena: { type: DataTypes.STRING, allowNull: false },
  t_doc: { type: DataTypes.STRING, allowNull: false },
  id_rol_usuario: { 
    type: DataTypes.STRING, 
    defaultValue: "2" // Asigna el rol "2" por defecto si no se envía
  }
});

module.exports = Cliente;