const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const HistoriaDestacadaItem = sequelize.define('HistoriaDestacadaItem', {
    id_destacado_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_agregado: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    DVH: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    id_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_historia: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'historia_destacada_items',
    timestamps: false,
    indexes: [{
        unique: true,
        fields: ['id_grupo', 'id_historia']
    }]
});

module.exports = HistoriaDestacadaItem;
