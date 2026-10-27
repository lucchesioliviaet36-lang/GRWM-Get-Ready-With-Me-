const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Historia = sequelize.define('Historia', {
    id_historia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imagen_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'historias',
    timestamps: false
});

module.exports = Historia;