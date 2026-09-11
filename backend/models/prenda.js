const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Prenda = sequelize.define(
    "Prenda",
    {
        id_prenda: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        categoria: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        color: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        imagen_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        origen: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        id_externo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    },
    {
        tableName: "prenda",
        timestamps: false
    }
);

module.exports = Prenda;
