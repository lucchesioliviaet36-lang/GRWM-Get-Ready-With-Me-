
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Pago = sequelize.define(
  "Pago",
  {
    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    metodo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    codigo_transaccion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado_pago: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    DVH: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "Pago",
    timestamps: false
  }
);

module.exports = Pago;
