const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

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
      type: DataTypes.INTEGER, 
      allowNull: true
    },

    recibido: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: false
    },

    fecha_entrega: {
      type: DataTypes.DATE, 
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
    
}, {
    tableName: "Pedido",
    timestamps: false
});

module.exports = Pedido;