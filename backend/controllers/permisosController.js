const rolServicio = require("../services/rolServicio.js");
const patenteServicio = require("../services/patenteServicio.js");
const rolPatenteServicio = require("../services/rolPatenteServicio.js");
const usuarioRolServicio = require("../services/usuarioRolServicio.js");
const usuarioPatenteServicio = require("../services/usuarioPatenteServicio.js");

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
    try {
        const roles = await rolServicio.obtenerTodos();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los roles", error: error.message });
    }
};

// Crear un rol
const crearRol = async (req, res) => {
    try {
        const { nombre_rol, descripcion } = req.body;

        if (!nombre_rol || !nombre_rol.trim()) {
            return res.status(400).json({
                mensaje: "El nombre del rol es obligatorio"
            });
        }

        const existente = await rolServicio.buscarPorNombre(nombre_rol.trim());

        if (existente) {
            return res.status(400).json({
                mensaje: "Ese rol ya existe"
            });
        }

        const rol = await rolServicio.crear({
            nombre_rol: nombre_rol.trim(),
            descripcion
        });

        res.status(201).json(rol);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el rol",
            error: error.message
        });
    }
};

// Obtener todas las patentes
const obtenerPatentes = async (req, res) => {
    try {
        const patentes = await patenteServicio.obtenerTodas();
        res.json(patentes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las patentes", error: error.message });
    }
};

// Crear una patente
const crearPatente = async (req, res) => {
    try {
        const { nombre_patente, descripcion } = req.body;

        if (!nombre_patente || !nombre_patente.trim()) {
            return res.status(400).json({
                mensaje: "El nombre de la patente es obligatorio"
            });
        }

        const existente = await patenteServicio.buscarPorNombre(nombre_patente.trim());

        if (existente) {
            return res.status(400).json({
                mensaje: "Esa patente ya existe"
            });
        }

        const patente = await patenteServicio.crear({
            nombre_patente: nombre_patente.trim(),
            descripcion
        });

        res.status(201).json(patente);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la patente",
            error: error.message
        });
    }
};

// Obtener las patentes de un rol
const obtenerPatentesPorRol = async (req, res) => {
    try {
        const { id_rol } = req.params;
        const patentes = await rolPatenteServicio.obtenerPorRol(id_rol);
        res.json(patentes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las patentes del rol", error: error.message });
    }
};

// Asignar una patente a un rol
const asignarPatente = async (req, res) => {
    try {
        const { id_rol, id_patente } = req.body;

        if (!id_rol || !id_patente) {
            return res.status(400).json({ mensaje: "Faltan el rol o la patente" });
        }

        const asignacion = await rolPatenteServicio.asignarPatente(id_rol, id_patente);
        res.status(201).json(asignacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al asignar la patente", error: error.message });
    }
};

// Eliminar una patente de un rol
const eliminarAsignacion = async (req, res) => {
    try {
        const { id_rol_patente } = req.params;
        await rolPatenteServicio.eliminarAsignacion(id_rol_patente);

        res.json({ mensaje: "Asignación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la asignación", error: error.message });
    }
};

// Obtener los roles de un usuario
const obtenerRolesUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const roles = await usuarioRolServicio.obtenerPorUsuario(id_usuario);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los roles del usuario", error: error.message });
    }
};

// Asignar un rol a un usuario
const asignarRolUsuario = async (req, res) => {
    try {
        const { id_usuario, id_rol } = req.body;

        if (!id_usuario || !id_rol) {
            return res.status(400).json({ mensaje: "Faltan el usuario o el rol" });
        }

        const asignacion = await usuarioRolServicio.asignarRol(id_usuario, id_rol);
        res.status(201).json(asignacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al asignar el rol", error: error.message });
    }
};

// Quitar un rol de un usuario
const quitarRolUsuario = async (req, res) => {
    try {
        const { id_usuario_rol } = req.params;
        await usuarioRolServicio.quitarRol(id_usuario_rol);

        res.json({ mensaje: "Rol eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al quitar el rol", error: error.message });
    }
};

// Obtener las restricciones de un usuario
const obtenerRestricciones = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const restricciones = await usuarioPatenteServicio.obtenerPorUsuario(id_usuario);
        res.json(restricciones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las restricciones", error: error.message });
    }
};

// Restringir una acción a un usuario
const restringirAccion = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_patente, dias } = req.body;

        if (!id_patente || !Number.isInteger(dias) || dias <= 0) {
            return res.status(400).json({
                mensaje: "Se necesita una patente y una cantidad de días válida"
            });
        }

        const restriccion = await usuarioPatenteServicio.restringirAccion(
            id_usuario,
            id_patente,
            dias
        );

        res.status(201).json({
            mensaje: "Restricción aplicada correctamente",
            restriccion
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al aplicar la restricción", error: error.message });
    }
};

// Quitar una restricción
const quitarRestriccion = async (req, res) => {
    try {
        const { id_usuario_patente } = req.params;

        await usuarioPatenteServicio.quitarRestriccion(id_usuario_patente);

        res.json({ mensaje: "Restricción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al quitar la restricción", error: error.message });
    }
};

const obtenerDatosGestion = async (req, res) => {
    try {
        const Usuario = require("../models/usuarioModels.js");

        const [
            usuarios,
            roles,
            patentes,
            usuariosRoles,
            rolesPatentes,
            restricciones
        ] = await Promise.all([
            Usuario.findAll({
                attributes: [
                    "id_usuario",
                    "nombre",
                    "apellido",
                    "username",
                    "mail"
                ]
            }),
            rolServicio.obtenerTodos(),
            patenteServicio.obtenerTodas(),
            usuarioRolServicio.obtenerTodos(),
            rolPatenteServicio.obtenerTodas(),
            usuarioPatenteServicio.obtenerTodas()
        ]);

        res.json({
            usuarios,
            roles,
            patentes,
            usuariosRoles,
            rolesPatentes,
            restricciones
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al cargar la gestión de permisos"
        });
    }
};

module.exports = {
    obtenerRoles,
    crearRol,
    obtenerPatentes,
    crearPatente,
    obtenerPatentesPorRol,
    asignarPatente,
    eliminarAsignacion,
    obtenerRolesUsuario,
    asignarRolUsuario,
    quitarRolUsuario,
    obtenerRestricciones,
    restringirAccion,
    quitarRestriccion,
    obtenerDatosGestion
};