const adminService = require("../services/adminService");

const obtenerBitacora = async (req, res) => {
    try {
        const bitacora = await adminService.obtenerBitacora();
        return res.status(200).json({success: true, bitacora});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};

const obtenerDVV = async (req, res) => {
    try {
        const dvv = await adminService.obtenerDVV();
        return res.status(200).json({success: true, dvv});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};

const verificarIntegridad = async (req, res) => {
    try {
        const resultado = await adminService.verificarIntegridad();
        return res.status(200).json({success: true, ...resultado});
    } catch (error) {
        console.error("Error verificando integridad:", error);
        return res.status(500).json({success: false, message: error.message});
    }
};

module.exports = {
    obtenerBitacora,
    obtenerDVV,
    verificarIntegridad
};