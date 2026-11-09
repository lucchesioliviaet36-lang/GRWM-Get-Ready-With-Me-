const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const HistoriaComentario = sequelize.define('HistoriaComentario', {
    id_comentario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_historia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_comentario: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'historia_comentarios',
    timestamps: false
});

module.exports = HistoriaComentario;
