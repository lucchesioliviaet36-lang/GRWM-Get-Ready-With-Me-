const prendaService = require("../services/prendaService");

const agregar = async (req, res) => {
    try{
        const idUsuario = req.user.id_usuario;
        const prenda = await prendaService.agregarPrenda(idUsuario, req.body);

        return res.status(201).json({
            success: true,
            prenda
        });

    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const obtenerMiArmario = async (req, res) => {
    try{
        const idUsuario = req.user.id_usuario;

        const prendas = await prendaService.obtenerArmario(idUsuario);

        return res.status(200).json({
            success: true,
            prendas
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};

const eliminar = async (req, res) => {
    try{
        const idUsuario = req.user.id_usuario;
        const {id} = req.params;

        await prendaService.eliminarPrenda(id, idUsuario);

        return res.status(200).json({
            success: true,
            message: "Prenda eliminada"
        });
    }
    catch (error) {
        return res.status(404),json({
            success: false,
            message: error.message
        });
    }
};

module.exports ={agregar, obtenerMiArmario, eliminar};