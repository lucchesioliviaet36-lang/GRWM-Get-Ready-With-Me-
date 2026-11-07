const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const HistoriaDestacadaGrupo = sequelize.define('HistoriaDestacadaGrupo', {
    id_grupo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    portada_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    DVH: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'historia_destacada_grupos',
    timestamps: false
});

module.exports = HistoriaDestacadaGrupo;
