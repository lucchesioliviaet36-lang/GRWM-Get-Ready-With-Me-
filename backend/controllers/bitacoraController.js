const bitacoraService = require("../services/bitacoraService");

// OBTENER REGISTROS DE BITACORA CON FILTROS
const obtenerTodos = async (req, res) => {
    try {
        const registros = await bitacoraService.obtenerTodos(req.query);

        return res.status(200).json(registros);
    } catch (error) {
        console.error("Error al obtener la bitácora:", error);
        return res.status(500).json({
            mensaje: "Error al obtener los registros de bitácora"
        });
    }
};

module.exports = {
    obtenerTodos
};