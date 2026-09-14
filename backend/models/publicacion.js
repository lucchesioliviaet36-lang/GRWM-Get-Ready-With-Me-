const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Publicacion = sequelize.define("Publicacion", {
    id_publicacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    fecha_publicacion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    DVH: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "Publicacion",
    timestamps: false
});

module.exports = Publicacion;