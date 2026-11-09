const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const DetallePedido = sequelize.define(
  "DetallePedido", 
  {
    id_detalle: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true
    },

    cantidad: {
      type: DataTypes.INTEGER, 
      allowNull: true
    },

    sub_total: {
      type: DataTypes.DECIMAL(10, 2),
     allowNull: false
    },

    codigo_seguimiento: {
      type: DataTypes.INTEGER, 
      allowNull: true
    },

    DVH: {
      type: DataTypes.INTEGER, 
      allowNull: true
    },

    id_pedido: {
      type: DataTypes.INTEGER, 
      allowNull: true
    },

    id_producto: {
      type: DataTypes.INTEGER, 
      allowNull: true
    }
    
}, {
    tableName: "Detalle_Pedido",
    timestamps: false
});

module.exports = DetallePedido;