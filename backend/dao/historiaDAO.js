const Historia = require('../models/historiasModel.js'); 

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
            return await Historia.findAll({
                order: [['fecha_creacion', 'DESC']] // <--- Forzamos que ordene por tu columna real
            });
        } catch (error) {
            throw new Error(`Error en DAO al obtener historias: ${error.message}`);
        }
    
    }
}

module.exports = new HistoriaDAO();