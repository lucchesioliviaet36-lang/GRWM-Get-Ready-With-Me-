const Historia = require('../models/historiasModel.js'); 
const HistoriaLike = require('../models/historiaLike.Model.js');
const HistoriaComentario = require('../models/historiaComentario.Model.js');
const Usuario = require('../models/usuarioModels.js');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database.js');
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
        const likesPorHistoria = await HistoriaLike.findAll({
            attributes: [
                'id_historia',
                [sequelize.fn('COUNT', sequelize.col('id_historia')), 'likesCount']
            ],
            group: ['id_historia'],
            raw: true
        });
        const likesPorId = new Map(
            likesPorHistoria.map((like) => [like.id_historia, Number(like.likesCount)])
        );

        res.json(historias.map((historia) => ({
            ...historia.get({ plain: true }),
            usuario: usuariosPorId.get(historia.id_usuario)?.username || `Usuario #${historia.id_usuario}`,
            foto_perfil: usuariosPorId.get(historia.id_usuario)?.foto_perfil || null,
            likesCount: likesPorId.get(historia.id_historia) || 0
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
        const id_usuario = Number(req.user?.id_usuario ?? req.user?.id);

        if (!imagen_url) {
            return res.status(400).json({ error: 'La imagen es obligatoria para la historia' });
        }

        if (!Number.isInteger(id_usuario) || id_usuario <= 0) {
            await fs.unlink(req.file.path);
            return res.status(401).json({ error: 'No se pudo identificar al usuario. Iniciá sesión nuevamente.' });
        }

        const usuario = await Usuario.findByPk(id_usuario, {
            attributes: ['id_usuario', 'username']
        });
        if (!usuario) {
            await fs.unlink(req.file.path);
            return res.status(401).json({
                error: 'La sesión pertenece a un usuario que ya no existe. Cerrá sesión e iniciá de nuevo.'
            });
        }

        const nuevaHistoria = await Historia.create({
            imagen_url,
            id_usuario
        });

        res.status(201).json({
            success: true,
            message: 'Historia creada con éxito',
            historia: {
                ...nuevaHistoria.get({ plain: true }),
                usuario: req.user?.username || usuario.username || `Usuario #${id_usuario}`
            }
        });
    } catch (error) {
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (cleanupError) {
                if (cleanupError.code !== 'ENOENT') {
                    console.error('Error al limpiar la imagen de historia no guardada:', cleanupError);
                }
            }
        }
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
        await sequelize.transaction(async (transaction) => {
            await HistoriaLike.destroy({ where: { id_historia: idHistoria }, transaction });
            await HistoriaComentario.destroy({ where: { id_historia: idHistoria }, transaction });
            await historia.destroy({ transaction });
        });

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

        await HistoriaLike.findOrCreate({
            where: { id_historia: idHistoria, id_usuario: idUsuario },
            defaults: { id_historia: idHistoria, id_usuario: idUsuario }
        });
        const likesCount = await HistoriaLike.count({ where: { id_historia: idHistoria } });

        return res.json({ success: true, likesCount });
    } catch (error) {
        console.error("Error al dar like a la historia:", error);
        res.status(500).json({ error: 'Error al procesar el like' });
    }
};

// 4. POST /api/historias/:id/comentar - Comentar una historia
const comentarHistoria = async (req, res) => {
    try {
        const idHistoria = Number(req.params.id);
        const idUsuario = Number(req.user?.id_usuario ?? req.user?.id);
        const comentario = typeof req.body?.comentario === 'string'
            ? req.body.comentario.trim()
            : '';

        if (!Number.isInteger(idHistoria) || idHistoria <= 0) {
            return res.status(400).json({ error: 'ID de historia inválido' });
        }

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(401).json({ error: 'No se pudo identificar al usuario' });
        }

        if (!comentario) {
            return res.status(400).json({ error: 'El comentario no puede estar vacío' });
        }

        const historia = await Historia.findByPk(idHistoria);
        if (!historia) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        const nuevoComentario = await HistoriaComentario.create({
            id_historia: idHistoria,
            id_usuario: idUsuario,
            comentario
        });

        return res.status(201).json({
            success: true,
            message: 'Comentario agregado a la historia con éxito',
            comentario: nuevoComentario.get({ plain: true })
        });
    } catch (error) {
        console.error("Error al comentar historia:", error);
        res.status(500).json({ error: 'Error al comentar la historia' });
    }
};

const obtenerComentariosHistoria = async (req, res) => {
    try {
        const idHistoria = Number(req.params.id);

        if (!Number.isInteger(idHistoria) || idHistoria <= 0) {
            return res.status(400).json({ error: 'ID de historia inválido' });
        }

        const historia = await Historia.findByPk(idHistoria);
        if (!historia) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        const comentarios = await HistoriaComentario.findAll({
            where: { id_historia: idHistoria },
            order: [['fecha_comentario', 'ASC']]
        });
        const idsUsuario = [...new Set(comentarios.map((comentario) => comentario.id_usuario))];
        const usuarios = idsUsuario.length
            ? await Usuario.findAll({
                attributes: ['id_usuario', 'username'],
                where: { id_usuario: { [Op.in]: idsUsuario } }
            })
            : [];
        const usuariosPorId = new Map(
            usuarios.map((usuario) => [usuario.id_usuario, usuario.username])
        );

        return res.json(comentarios.map((comentario) => ({
            ...comentario.get({ plain: true }),
            username: usuariosPorId.get(comentario.id_usuario) || `Usuario #${comentario.id_usuario}`
        })));
    } catch (error) {
        console.error('Error al obtener comentarios de historia:', error);
        return res.status(500).json({ error: 'Error al consultar los comentarios' });
    }
};

module.exports = {
    obtenerHistorias,
    crearHistoria,
    eliminarHistoria,
    darLikeHistoria,
    comentarHistoria,
    obtenerComentariosHistoria
};