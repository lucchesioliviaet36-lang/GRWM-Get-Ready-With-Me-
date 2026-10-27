const Historia = require('../services/historiaService.js'); 

const obtenerHistorias = async (req, res) => {
    try {
        const historias = await Historia.findAll();
        res.json(historias);
    } catch (error) {
        console.error("Error al obtener historias:", error);
        res.status(500).json({ error: 'Error al consultar las historias' });
    }
};

module.exports = { obtenerHistorias };