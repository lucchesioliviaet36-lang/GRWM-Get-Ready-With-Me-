const usuarioRolServicio = require("../services/usuarioRolServicio.js");
const { sequelize } = require("../config/database.js");

const asignarAdministrador = async () => {
    try {
        await sequelize.authenticate();

        await usuarioRolServicio.asignarRol(2, 1);

        console.log("¡Rol administrador asignado correctamente!");
    } catch (error) {
        console.error("Error al asignar administrador:", error);
    } finally {
        await sequelize.close();
    }
};

asignarAdministrador();
