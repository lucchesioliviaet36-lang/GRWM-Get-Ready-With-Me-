const catalogoService = require ("../services/catalogoService");

const obtenerPorCategoria = async (req, res) => {
    try{
        const {categoria} = req.params;
        const productos = await catalogoService.obtenerParaGRWM(categoria);

        if(productos.length === 0) {
            return res.status(404).json({
                success: false,
                message:"Categoria no encontrada"
            });
        }

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