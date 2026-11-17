const rolServicio = require("../services/rolServicio.js");
const patenteServicio = require("../services/patenteServicio.js");
const rolPatenteServicio = require("../services/rolPatenteServicio.js");
const usuarioRolServicio = require("../services/usuarioRolServicio.js");
const usuarioDAO = require("../dao/usuarioDAO.js");
const { sequelize } = require("../config/database.js");

const cargarPermisosIniciales = async () => {
    try {
        await sequelize.authenticate();

        console.log("Conexión establecida.");

        // 1. Crear roles
        let rolAdmin = await rolServicio.buscarPorNombre("administrador");

        if (!rolAdmin) {
            rolAdmin = await rolServicio.crear({
                nombre_rol: "administrador",
                descripcion: "Administrador del sistema"
            });
        }

        let rolUsuario = await rolServicio.buscarPorNombre("usuario");

        if (!rolUsuario) {
            rolUsuario = await rolServicio.crear({
                nombre_rol: "usuario",
                descripcion: "Usuario común"
            });
        }

        // 2. Crear patentes
        const datosPatentes = [
            ["CREAR_PUBLICACION", "Crear publicaciones"],
            ["COMENTAR_PUBLICACION", "Comentar publicaciones"],
            ["DAR_LIKE", "Dar me gusta"],
            ["GUARDAR_FAVORITO", "Guardar publicaciones favoritas"],
            ["CREAR_HISTORIA", "Crear historias"],
            ["ENVIAR_MENSAJE", "Enviar mensajes"],
            ["COMPRAR_PRODUCTO", "Comprar productos"],
            ["CALIFICAR_PRODUCTO", "Calificar productos"]
        ];

        for (const [nombre, descripcion] of datosPatentes) {
            const existente = await patenteServicio.buscarPorNombre(nombre);

            if (!existente) {
                await patenteServicio.crear({
                    nombre_patente: nombre,
                    descripcion
                });
            }
        }

        // 3. Obtener patentes y asignaciones existentes
        const patentes = await patenteServicio.obtenerTodas();

        const asignacionesAdmin =
            await rolPatenteServicio.obtenerPorRol(rolAdmin.id_rol);

        const asignacionesUsuario =
            await rolPatenteServicio.obtenerPorRol(rolUsuario.id_rol);

        // 4. Asignar todas las patentes al administrador
        for (const patente of patentes) {
            const existe = asignacionesAdmin.some(
                a => Number(a.id_patente) === Number(patente.id_patente)
            );

            if (!existe) {
                await rolPatenteServicio.asignarPatente(
                    rolAdmin.id_rol,
                    patente.id_patente
                );
            }
        }

        // 5. Asignar patentes al usuario común
        for (const nombre of [
            "CREAR_PUBLICACION",
            "COMENTAR_PUBLICACION",
            "DAR_LIKE",
            "GUARDAR_FAVORITO",
            "CREAR_HISTORIA",
            "ENVIAR_MENSAJE",
            "COMPRAR_PRODUCTO",
            "CALIFICAR_PRODUCTO"
        ]) {
            const patente = patentes.find(
                p => p.nombre_patente === nombre
            );

            const existe = asignacionesUsuario.some(
                a => Number(a.id_patente) === Number(patente.id_patente)
            );

            if (!existe) {
                await rolPatenteServicio.asignarPatente(
                    rolUsuario.id_rol,
                    patente.id_patente
                );
            }
        }

        // 6. Asignar rol usuario a las cuentas que todavía no tengan uno
        const usuarios = await usuarioDAO.obtenerTodos();

        for (const usuario of usuarios) {
            const roles = await usuarioRolServicio.obtenerPorUsuario(
                usuario.id_usuario
            );

            if (roles.length === 0) {
                await usuarioRolServicio.asignarRol(
                    usuario.id_usuario,
                    rolUsuario.id_rol
                );
            }
        }

        console.log("¡Carga inicial terminada correctamente!");

    } catch (error) {
        console.error("Error al cargar permisos:", error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
};

cargarPermisosIniciales();