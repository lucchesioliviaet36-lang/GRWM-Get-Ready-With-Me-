const Historia = require('../services/historiaService.js'); 

// 1. GET /api/historias - Obtener todas las historias
const obtenerHistorias = async (req, res) => {
    try {
        const historias = await Historia.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(historias);
    } catch (error) {
        console.error("Error al obtener historias:", error);
        res.status(500).json({ error: 'Error al consultar las historias' });
    }
};

// 2. POST /api/historias/historia - Subir una nueva historia
const crearHistoria = async (req, res) => {
    try {
        const imagen_url = req.file ? `/uploads/historias/${req.file.filename}` : null;
        const id_usuario = req.usuario ? req.usuario.id : req.body.id_usuario;

        if (!imagen_url) {
            return res.status(400).json({ error: 'La imagen es obligatoria para la historia' });
        }

        const nuevaHistoria = await Historia.create({ 
            imagen_url,
            id_usuario,
            likesCount: 0
        });

        res.status(201).json({
            success: true,
            message: 'Historia creada con éxito',
            historia: nuevaHistoria
        });
    } catch (error) {
        console.error("Error al crear historia:", error);
        res.status(500).json({ error: 'Error al crear la historia' });
    }
};

// 3. POST /api/historias/:id/like - Dar like a una historia
const darLikeHistoria = async (req, res) => {
    try {
        const { id } = req.params;
        const historia = await Historia.findByPk(id);

        if (!historia) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        // Incrementamos el contador de likes (podes adaptarlo si usas una tabla intermedia de likes)
        historia.likesCount = (historia.likesCount || 0) + 1;
        await historia.save();

        res.json({ success: true, likesCount: historia.likesCount });
    } catch (error) {
        console.error("Error al dar like a la historia:", error);
        res.status(500).json({ error: 'Error al procesar el like' });
    }
};

// 4. POST /api/historias/:id/comentar - Comentar una historia
const comentarHistoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario } = req.body;

        // Si tenés un modelo de comentarios para historias, lo guardás acá. 
        // Por ahora devolvemos una respuesta exitosa de simulación/registro.
        res.status(201).json({
            success: true,
            message: 'Comentario agregado a la historia con éxito',
            comentario
        });
    } catch (error) {
        console.error("Error al comentar historia:", error);
        res.status(500).json({ error: 'Error al comentar la historia' });
    }
};

module.exports = {
    obtenerHistorias,
    crearHistoria,
    darLikeHistoria,
    comentarHistoria
};