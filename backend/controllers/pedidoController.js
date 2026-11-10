const pedidoService = require("../services/pedidoService");

const obtenerPedido = async (req, res) => {
    try {
        const resultado = await pedidoService.obtenerPedido(
            req.params.id,
            req.user.id_usuario
        );

        return res.status(200).json({
            success: true,
            ...resultado
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const confirmarRecepcion = async (req, res) => {
    try {
        const resultado = await pedidoService.confirmarRecepcion(
            req.params.id,
            req.user.id_usuario
        );

        return res.status(200).json({
            success: true,
            message: "Pedido marcado como recibido",
            ...resultado
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    obtenerPedido,
    confirmarRecepcion
};