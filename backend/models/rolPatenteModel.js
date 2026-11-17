const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const RolPatente = sequelize.define(
    "RolPatente",
    {
        id_rol_patente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        DVH: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        id_patente: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "Rol_Patente",
        timestamps: false
    }
);

module.exports = RolPatente;