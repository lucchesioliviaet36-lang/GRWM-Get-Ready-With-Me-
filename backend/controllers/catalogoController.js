const catalogoService = require ("../services/catalogoService");

const obtenerPorCategoria = async (req, res) => {
    try{
        const {categoria} = req.params;
        const productos = await catalogoService.obtenerPorCategoria(categoria);

        return res.status(200).json({
            success: true,
            productos
        });

    }
    catch (error) {
        console.error("Error obtenido del catalogo: ", error);

        return res.status(500).json({
            success: false,
            message: "No se pudo obtener el catalogo"
        });
    }
};

module.exports = { obtenerPorCategoria };