const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const HistoriaLike = sequelize.define('HistoriaLike', {
    id_like: {
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
    fecha_like: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'historia_likes',
    timestamps: false,
    indexes: [{
        unique: true,
        fields: ['id_historia', 'id_usuario']
    }]
});

module.exports = HistoriaLike;
