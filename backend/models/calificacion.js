const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const Calificacion = sequelize.define("Calificacion", {
    
    id_calificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    comentario: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    puntuacion: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    DVH: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

}, {
    tableName: "Calificacion",
    timestamps: false
});

module.exports = Calificacion;