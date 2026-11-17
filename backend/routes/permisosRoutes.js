const express = require("express");
const router = express.Router();

const permisosController = require("../controllers/permisosController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const adminMiddleware = require("../middlewares/adminMiddleware.js");

// Proteger todas las rutas
router.use(authMiddleware);
router.use(adminMiddleware);

// Roles
router.get("/roles", permisosController.obtenerRoles);
router.post("/roles", permisosController.crearRol);

// Patentes
router.get("/patentes", permisosController.obtenerPatentes);
router.post("/patentes", permisosController.crearPatente);

// Relación entre roles y patentes
router.get("/roles/:id_rol/patentes", permisosController.obtenerPatentesPorRol);
router.post("/roles/patentes", permisosController.asignarPatente);
router.delete("/roles/patentes/:id_rol_patente", permisosController.eliminarAsignacion);

// Roles de usuarios
router.get("/usuarios/:id_usuario/roles", permisosController.obtenerRolesUsuario);
router.post("/usuarios/roles", permisosController.asignarRolUsuario);
router.delete("/usuarios/roles/:id_usuario_rol", permisosController.quitarRolUsuario);

// Restricciones individuales
router.get("/usuarios/:id_usuario/restricciones", permisosController.obtenerRestricciones);
router.post("/usuarios/:id_usuario/restricciones", permisosController.restringirAccion);
router.patch("/restricciones/:id_usuario_patente", permisosController.quitarRestriccion);

router.get("/gestion", permisosController.obtenerDatosGestion);

module.exports = router;