const iaOutfitService = require("../services/iaOutfitService");

// OBTENER PRENDAS DISPONIBLES
// Esto se va a usar para que React muestre:
// - Mi Armario
// - Inspiración
// y permita buscar y elegir prendas.
const obtenerPrendasDisponibles = async (req, res) => {

    try {
        const idUsuario = req.user.id_usuario;
        const { categorias, modo, q} = req.query;
        let categoriasArray;

        if (categorias) {
            categoriasArray =categorias.split(",").map((categoria) => categoria.trim()).filter(Boolean);
        } 
        else {
            categoriasArray = [
                "remeras",
                "abrigos",
                "partes_abajo",
                "zapatos",
                "carteras",
                "accesorios"
            ];
        }

        const prendas =
            await iaOutfitService.obtenerCandidatos({
                idUsuario,
                categorias: categoriasArray,
                modo:  modo || "mixto",
                busqueda: q || ""
            });

        return res.status(200).json({
            success: true,
            cantidad:prendas.length, 
            prendas
        });

    } catch (error) {
        console.error(
            "Error obteniendo prendas IA:",
            error
        );
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GENERAR OUTFIT
const generarOutfit = async ( req, res ) => {

    try {
        const idUsuario =req.user.id_usuario;
        const {
            mensaje,
            temporada,
            categorias,
            modo,
            prendasSeleccionadas,
            prendasEvitar
        } = req.body;

        const outfit =
            await iaOutfitService.generarOutfit({
                idUsuario,
                mensaje,
                temporada,
                categorias,
                modo:modo || "mixto",
                prendasSeleccionadas: prendasSeleccionadas || [],
                prendasEvitar: prendasEvitar || []
            });

        return res.status(200).json({
            success: true,
            outfit
        });

    } catch (error) {
        console.error(
            "Error generando outfit:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = { obtenerPrendasDisponibles, generarOutfit };