const Historia = require('../models/historias.Model.js'); 

class HistoriaDAO {
    async crear(datosHistoria) {
        try {
            return await Historia.create(datosHistoria);
        } catch (error) {
            throw new Error(`Error en DAO al crear historia: ${error.message}`);
        }
    }

    async obtenerTodas() {
        try {
            return await Historia.findAll();
        } catch (error) {
            throw new Error(`Error en DAO al obtener historias: ${error.message}`);
        }
    }
}

module.exports = new HistoriaDAO();