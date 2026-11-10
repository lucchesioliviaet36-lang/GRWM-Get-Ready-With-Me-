const calificacionService = require("../services/calificacionService");

const crear = async (req, res) => {
    try {
        const calificacion = await calificacionService.crearCalificacion(
            req.user.id_usuario,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Calificación guardada correctamente",
            calificacion
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const obtenerPorVendedor = async (req, res) => {
    try {
        const resultado = await calificacionService.obtenerCalificacionesVendedor(
            req.params.idUsuario
        );

        return res.status(200).json({
            success: true,
            ...resultado
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crear,
    obtenerPorVendedor
};