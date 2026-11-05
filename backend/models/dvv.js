const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const DVV = sequelize.define(
    "DVV",
    {
        id_dvv: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre_tabla: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        DVH: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        fecha_actualizacion: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    },
    {
        tableName: "DVV",
        timestamps: false
    }
);

module.exports = DVV;