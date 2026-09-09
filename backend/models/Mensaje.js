const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mensaje = sequelize.define('Mensaje', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  remitenteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  destinatarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
});

module.exports = Mensaje;