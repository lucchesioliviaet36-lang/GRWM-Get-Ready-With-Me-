const Bitacora = require("../models/bitacora");
const digitoVerificadorService = require("./digitoVerificadorService");

// ACTUALIZAR DVV DE BITACORA
const actualizarDVV = async () => {
    const registros = await Bitacora.findAll({
        order: [["id_bitacora", "ASC"]]
    });

    const DVV = digitoVerificadorService.calcularDVV(registros);
    await digitoVerificadorService.guardarDVV( "Bitacora", DVV );
    return DVV;
};

// REGISTRAR ACCION EN BITACORA
const registrar = async ({
    idUsuario,
    descripcion,
    accion,
    tablaAfectada,
    usuarioAfectado
}) => {
    const registro = await Bitacora.create({
        descripcion,
        accion,
        tabla_afectada: tablaAfectada,
        usuario_afectado: String(usuarioAfectado),
        fecha: new Date(),
        DVH: null,
        id_usuario: idUsuario
    });

    const DVH = digitoVerificadorService.calcularDVH(registro);

    await registro.update({DVH});
    await actualizarDVV();
    return registro;
};

module.exports = {
    registrar,
    actualizarDVV
};