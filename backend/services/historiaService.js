const historiaDAO = require('../dao/historiaDAO');

class HistoriaService {
	async registrarHistoria(datos) {
		try {
			// Aquí puedes agregar validaciones adicionales si las necesitas
			const nuevaHistoria = await historiaDAO.crear(datos);
			return nuevaHistoria;
		} catch (error) {
			throw new Error(`Error en Service: ${error.message}`);
		}
	}

	async traerTodasLasHistorias() {
		try {
			return await historiaDAO.obtenerTodas();
		} catch (error) {
			throw new Error(`Error en Service: ${error.message}`);
		}
	}
}

module.exports = new HistoriaService();
