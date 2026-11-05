const crypto = require("crypto");
const DVV = require("../models/dvv");

// GENERAR HASH NUMÉRICO
const generarHashNumerico = (texto) => {
    const hash = crypto.createHash("sha256").update(String(texto)).digest("hex");
    const numero = parseInt(hash.substring(0, 8), 16);
    return numero & 0x7fffffff;
};

// NORMALIZAR VALOR
const normalizarValor = (valor) => {
    if (valor === null || valor === undefined) {
        return "";
    }

    if (valor instanceof Date) {
        return valor.toISOString();
    }

    if (typeof valor === "object") {
        return JSON.stringify(valor);
    }

    return String(valor);
};

// CALCULAR DVH
const calcularDVH = (registro) => {
    const datos = registro.toJSON ? registro.toJSON() : registro;
    const campos = Object.keys(datos).filter((campo) => campo !== "DVH").sort();
    const cadena = campos .map((campo) =>
        `${campo}:${normalizarValor(datos[campo])}`).join("|");

    return generarHashNumerico(cadena);
};

// CALCULAR DVV
const calcularDVV = (registros) => {
    const cadena = registros.map((registro) => registro.DVH || 0).join("|");

    return generarHashNumerico(cadena);
};

// GUARDAR DVV
const guardarDVV = async (nombreTabla, valorDVV) => {
    const existente = await DVV.findOne({
        where: {
            nombre_tabla: nombreTabla
        }
    });

    if (existente) {
        await existente.update({ DVH: valorDVV, fecha_actualizacion: new Date()});
        return existente;
    }

    return await DVV.create({
        nombre_tabla: nombreTabla,
        DVH: valorDVV,
        fecha_actualizacion: new Date()
    });
};

// RECALCULAR DVV DE UNA TABLA
const recalcularTabla = async (Modelo, nombreTabla, idCampo) => {
    const registros = await Modelo.findAll({
        order: [
            [idCampo, "ASC"]
        ]
    });

    const valorDVV = calcularDVV(registros);
    await guardarDVV( nombreTabla, valorDVV );
    return valorDVV;
};

// RECALCULAR DVH DE UN REGISTRO Y DVV DE LA TABLA
const recalcularRegistroYTabla = async ( Modelo, nombreTabla, idCampo, idRegistro) => {
    const registro = await Modelo.findOne({
        where: {
            [idCampo]: idRegistro
        }
    });

    if (!registro) {
        throw new Error(
            `No se encontró el registro en ${nombreTabla}`
        );
    }

    const DVH = calcularDVH(registro);
    await Modelo.update(
        {DVH},
        {
            where: {[idCampo]: idRegistro}
        }
    );

    await recalcularTabla( Modelo, nombreTabla, idCampo );
    return DVH;
};

// VERIFICAR INTEGRIDAD DE UNA TABLA
const verificarTabla = async ( Modelo, nombreTabla, idCampo ) => {
    const registros = await Modelo.findAll({
        order: [[idCampo, "ASC"]]
    });

    const errores = [];

    for (const registro of registros) {
        const DVHCalculado = calcularDVH(registro);

        if (registro.DVH !== DVHCalculado) {
            errores.push({
                id: registro[idCampo],
                error: "DVH incorrecto"
            });
        }
    }

    const DVVCalculado = calcularDVV(registros);

    const DVVGuardado = await DVV.findOne({
        where: {nombre_tabla: nombreTabla}
    });

    if ( !DVVGuardado ||  DVVGuardado.DVH !== DVVCalculado ) {
        errores.push({
            tabla: nombreTabla,
            error: "DVV incorrecto"
        });
    }

    return { valido: errores.length === 0,  errores };
};

module.exports = {
    generarHashNumerico,
    normalizarValor,
    calcularDVH,
    calcularDVV,
    guardarDVV,
    recalcularTabla,
    recalcularRegistroYTabla,
    verificarTabla
};