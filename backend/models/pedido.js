
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Pedido = sequelize.define(
  "Pedido",
  {
    id_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha_pedido: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado_pedido: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    DVH: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "Pedido",
    timestamps: false
  }
);

module.exports = Pedido;
