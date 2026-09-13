const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Producto = sequelize.define(
    "Producto",
    {
        id_producto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        stock: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 1
        },

        categoria: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        
        imagen: {
            type: DataTypes.STRING(255),
            allowNull: true
        },        

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        estado_producto: {
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
        tableName: "Producto",
        timestamps: false
    }
);

module.exports = Producto;