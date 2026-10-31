const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const PublicacionEtiquetado = sequelize.define("PublicacionEtiquetado", {

    id_etiquetado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    fecha_etiquetado: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    DVH: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "Publicacion_Etiquetado",
    timestamps: false
});

module.exports = PublicacionEtiquetado;