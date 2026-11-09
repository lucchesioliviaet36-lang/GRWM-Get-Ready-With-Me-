const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/database.js");

const Historia = sequelize.define('Historia', {
    id_historia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imagen_url: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'historias',
    timestamps: true, // Activamos timestamps
    createdAt: 'fecha_creacion', // Mapeamos createdAt a tu columna real
    updatedAt: false // Desactivamos updatedAt si no lo tenés en la tabla
});

module.exports = Historia;