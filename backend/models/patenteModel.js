const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Patente = sequelize.define(
    "Patente",
    {
        id_patente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_patente: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        DVH: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "Patente",
        timestamps: false
    }
);

module.exports = Patente;