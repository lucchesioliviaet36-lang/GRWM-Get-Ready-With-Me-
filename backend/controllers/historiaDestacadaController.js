const { Op } = require('sequelize');
const { sequelize } = require('../config/database.js');
const Historia = require('../models/historias.Model.js');
const HistoriaDestacadaGrupo = require('../models/historiaDestacadaGrupo.Model.js');
const HistoriaDestacadaItem = require('../models/historiaDestacadaItem.Model.js');

const obtenerGrupos = async (req, res) => {
    try {
        const idUsuario = Number(req.params.idUsuario);
        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        const grupos = await HistoriaDestacadaGrupo.findAll({
            where: { id_usuario: idUsuario },
            order: [['fecha_creacion', 'DESC']]
        });
        const idsGrupo = grupos.map((grupo) => grupo.id_grupo);
        const items = idsGrupo.length
            ? await HistoriaDestacadaItem.findAll({
                where: { id_grupo: { [Op.in]: idsGrupo } },
                order: [['fecha_agregado', 'ASC']]
            })
            : [];
        const idsHistoria = [...new Set(items.map((item) => item.id_historia))];
        const historias = idsHistoria.length
            ? await Historia.findAll({ where: { id_historia: { [Op.in]: idsHistoria } } })
            : [];
        const historiasPorId = new Map(
            historias.map((historia) => [historia.id_historia, historia.get({ plain: true })])
        );
        const itemsPorGrupo = new Map();

        for (const item of items) {
            const historia = historiasPorId.get(item.id_historia);
            if (!historia) continue;
            const historiasDelGrupo = itemsPorGrupo.get(item.id_grupo) || [];
            historiasDelGrupo.push(historia);
            itemsPorGrupo.set(item.id_grupo, historiasDelGrupo);
        }

        return res.json({
            grupos: grupos.map((grupo) => ({
                ...grupo.get({ plain: true }),
                historias: itemsPorGrupo.get(grupo.id_grupo) || []
            }))
        });
    } catch (error) {
        console.error('Error al obtener historias destacadas:', error);
        return res.status(500).json({ error: 'Error al consultar las historias destacadas' });
    }
};

const crearGrupo = async (req, res) => {
    try {
        const idUsuario = Number(req.user?.id_usuario ?? req.user?.id);
        const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
        const idsHistoria = Array.isArray(req.body?.ids_historia)
            ? [...new Set(req.body.ids_historia.map(Number))]
            : [];

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(401).json({ error: 'No se pudo identificar al usuario' });
        }
        if (!nombre || nombre.length > 50) {
            return res.status(400).json({ error: 'El nombre debe tener entre 1 y 50 caracteres' });
        }
        if (!idsHistoria.length || idsHistoria.some((id) => !Number.isInteger(id) || id <= 0)) {
            return res.status(400).json({ error: 'Seleccioná al menos una historia válida' });
        }

        const historias = await Historia.findAll({
            where: {
                id_historia: { [Op.in]: idsHistoria },
                id_usuario: idUsuario
            }
        });
        if (historias.length !== idsHistoria.length) {
            return res.status(400).json({ error: 'Solo podés destacar tus propias historias' });
        }

        const porId = new Map(historias.map((historia) => [historia.id_historia, historia]));
        const ordenadas = idsHistoria.map((id) => porId.get(id));
        const portadaSolicitada = typeof req.body?.portada_url === 'string'
            ? req.body.portada_url
            : '';
        const portadaHistoria = ordenadas.find((historia) => historia.imagen_url === portadaSolicitada);
        const portadaUrl = portadaHistoria?.imagen_url || ordenadas[0].imagen_url;

        const grupo = await sequelize.transaction(async (transaction) => {
            const nuevoGrupo = await HistoriaDestacadaGrupo.create({
                nombre,
                portada_url: portadaUrl,
                id_usuario: idUsuario
            }, { transaction });

            await HistoriaDestacadaItem.bulkCreate(
                idsHistoria.map((id_historia) => ({
                    id_grupo: nuevoGrupo.id_grupo,
                    id_historia
                })),
                { transaction }
            );
            return nuevoGrupo;
        });

        return res.status(201).json({
            success: true,
            grupo: {
                ...grupo.get({ plain: true }),
                historias: ordenadas.map((historia) => historia.get({ plain: true }))
            }
        });
    } catch (error) {
        console.error('Error al crear grupo de historias destacadas:', error);
        return res.status(500).json({ error: 'Error al crear el grupo destacado' });
    }
};

const eliminarGrupo = async (req, res) => {
    try {
        const idUsuario = Number(req.user?.id_usuario ?? req.user?.id);
        const idGrupo = Number(req.params.idGrupo);
        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(401).json({ error: 'No se pudo identificar al usuario' });
        }
        if (!Number.isInteger(idGrupo) || idGrupo <= 0) {
            return res.status(400).json({ error: 'ID de grupo inválido' });
        }

        const grupo = await HistoriaDestacadaGrupo.findOne({
            where: { id_grupo: idGrupo, id_usuario: idUsuario }
        });
        if (!grupo) {
            return res.status(404).json({ error: 'Grupo destacado no encontrado' });
        }

        await grupo.destroy();
        return res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar grupo de historias destacadas:', error);
        return res.status(500).json({ error: 'Error al eliminar el grupo destacado' });
    }
};

module.exports = { obtenerGrupos, crearGrupo, eliminarGrupo };
