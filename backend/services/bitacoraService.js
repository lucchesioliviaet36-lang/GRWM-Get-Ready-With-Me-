const Bitacora = require("../models/bitacora");
const digitoVerificadorService = require("./digitoVerificadorService");

// ACTUALIZAR DVV DE BITACORA
const actualizarDVV = async () => {
    const registros = await Bitacora.findAll({
        order: [
            ["id_bitacora", "ASC"]
        ]
    });

    const DVV = digitoVerificadorService.calcularDVV(registros);
    await digitoVerificadorService.guardarDVV("Bitacora", DVV);

    return DVV;
};

// REGISTRAR ACCIÓN EN BITACORA
const registrar = async ({
    idUsuario,
    descripcion,
    accion,
    tablaAfectada,
    usuarioAfectado
}) => {
    const datos = {
        descripcion,
        accion,
        tabla_afectada: tablaAfectada,
        usuario_afectado: String(usuarioAfectado),
        fecha: new Date(),
        id_usuario: idUsuario
    };

    datos.DVH = digitoVerificadorService.calcularDVH(datos);

    const registro = await Bitacora.create(datos);
    await actualizarDVV();

    return registro;
};

module.exports = {registrar, actualizarDVV};