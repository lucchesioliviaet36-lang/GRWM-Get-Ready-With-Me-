const Historia = require('../models/historias.Model.js'); 
const Usuario = require('../models/usuarioModels.js');
const { Op } = require('sequelize');
const fs = require('fs/promises');
const path = require('path');

// 1. GET /api/historias - Obtener todas las historias
const obtenerHistorias = async (req, res) => {
    try {
        const historias = await Historia.findAll({
            order: [['fecha_creacion', 'DESC']]
        });
        const idsUsuario = [...new Set(historias.map((historia) => historia.id_usuario))];
        const usuarios = idsUsuario.length
            ? await Usuario.findAll({
                attributes: ['id_usuario', 'username', 'foto_perfil'],
                where: { id_usuario: { [Op.in]: idsUsuario } }
            })
            : [];
        const usuariosPorId = new Map(
            usuarios.map((usuario) => [usuario.id_usuario, usuario.get({ plain: true })])
        );

        res.json(historias.map((historia) => ({
            ...historia.get({ plain: true }),
            usuario: usuariosPorId.get(historia.id_usuario)?.username || `Usuario #${historia.id_usuario}`,
            foto_perfil: usuariosPorId.get(historia.id_usuario)?.foto_perfil || null
        })));
    } catch (error) {
        console.error("Error al obtener historias:", error);
        res.status(500).json({ error: 'Error al consultar las historias' });
    }
};

// 2. POST /api/historias/historia - Subir una nueva historia
const crearHistoria = async (req, res) => {
    try {
        const imagen_url = req.file ? `/uploads/historias/${req.file.filename}` : null;
        const id_usuario = req.user?.id_usuario ?? req.body.id_usuario;

        if (!imagen_url) {
            return res.status(400).json({ error: 'La imagen es obligatoria para la historia' });
        }

        if (!Number.isInteger(Number(id_usuario))) {
            return res.status(400).json({ error: 'No se pudo identificar al usuario de la historia' });
        }

        const nuevaHistoria = await Historia.create({
            imagen_url,
            id_usuario: Number(id_usuario)
        });

        res.status(201).json({
            success: true,
            message: 'Historia creada con éxito',
            historia: {
                ...nuevaHistoria.get({ plain: true }),
                usuario: req.user?.username || `Usuario #${id_usuario}`
            }
        });
    } catch (error) {
        console.error("Error al crear historia:", error);
        res.status(500).json({ error: 'Error al crear la historia' });
    }
};

const eliminarHistoria = async (req, res) => {
    try {
        const idHistoria = Number(req.params.id);
        const idUsuario = Number(req.user?.id_usuario ?? req.user?.id);

        if (!Number.isInteger(idHistoria) || idHistoria <= 0) {
            return res.status(400).json({ error: 'ID de historia inválido' });
        }

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(401).json({ error: 'No se pudo identificar al usuario' });
        }

        const historia = await Historia.findByPk(idHistoria);
        if (!historia) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        if (Number(historia.id_usuario) !== idUsuario) {
            return res.status(403).json({ error: 'Solo podés eliminar tu propia historia' });
        }

        const rutaImagen = historia.imagen_url;
        await historia.destroy();

        const nombreArchivo = path.basename(rutaImagen || '');
        if (rutaImagen?.startsWith('/uploads/historias/') && nombreArchivo) {
            const rutaUploads = path.resolve(__dirname, '../uploads/historias');
            const rutaArchivo = path.resolve(rutaUploads, nombreArchivo);

            if (rutaArchivo.startsWith(`${rutaUploads}${path.sep}`)) {
                try {
                    await fs.unlink(rutaArchivo);
                } catch (error) {
                    if (error.code !== 'ENOENT') throw error;
                }
            }
        }

        return res.status(200).json({ success: true, message: 'Historia eliminada' });
    } catch (error) {
        console.error('Error al eliminar historia:', error);
        return res.status(500).json({ error: 'Error al eliminar la historia' });
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
    eliminarHistoria,
    darLikeHistoria,
    comentarHistoria
};