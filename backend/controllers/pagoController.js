const pagoService = require("../services/pagoService");

const obtenerSaldo = async (req, res) => {
    try {
        const saldo = await pagoService.obtenerSaldo(req.user.id_usuario);
        return res.status(200).json({success: true, saldo});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
};

const cargarSaldo = async (req, res) => {
    try {
        const saldo = await pagoService.cargarSaldo(req.user.id_usuario, req.body.monto);
        return res.status(200).json({success: true, saldo});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
};

const comprarEnEfectivo = async (req, res) => {
    try {
        const resultado =
            await pagoService.comprarEnEfectivo(
                req.user.id_usuario,
                req.body.idProducto
            );

        return res.status(201).json({
            success: true,
            message:
                "Compra en efectivo registrada correctamente",
            ...resultado
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const comprarProducto = async (req, res) => {
    try {
        const resultado = await pagoService.comprarProducto(
            req.user.id_usuario,
            req.body.idProducto
        );

        return res.status(201).json({
            success: true,
            message: "Compra realizada correctamente",
            ...resultado
        });

    } catch (error) {
        if (error.codigo === "SALDO_INSUFICIENTE") {
            return res.status(409).json({
                success: false,
                codigo: error.codigo,
                message: error.message,
                saldo: error.saldo,
                total: error.total,
                faltante: error.faltante
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    obtenerSaldo,
    cargarSaldo,
    comprarEnEfectivo,
    comprarProducto
};