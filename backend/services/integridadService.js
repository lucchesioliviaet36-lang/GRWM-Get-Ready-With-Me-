const {sequelize} = require("../config/database");
const digitoVerificadorService = require("./digitoVerificadorService");


// NOMBRE QUE USAMOS EN LA TABLA DVV
const obtenerNombreDVV = (Modelo) => {
    const nombres = {
        Usuario: "Usuario",
        Seguidores: "Seguidores",
        Bitacora: "Bitacora",
        Publicacion: "Publicacion",
        PublicacionEtiquetado: "Publicacion_Etiquetado",
        PublicacionComentario: "Publicacion_Comentario",
        Publicacion_Favorito: "Publicacion_Favorito",
        Favorito: "Publicacion_Favorito",
        Like: "Publicacion_Like",
        Producto: "Producto",
        Pedido: "Pedido",
        DetallePedido: "Detalle_Pedido",
        Pago: "Pago",
        Calificacion: "Calificacion",
        Prenda: "Prenda"
    };

    return nombres[Modelo.name] || Modelo.name;
};


// OBTENER MODELOS QUE TIENEN DVH
const obtenerModelosIntegridad = () => {
    return Object.values(sequelize.models).filter((Modelo) => {
        return (
            Modelo.name !== "DVV" &&
            Modelo.rawAttributes?.DVH &&
            Modelo.primaryKeyAttribute
        );
    });
};


// VERIFICAR INTEGRIDAD
const verificarIntegridad = async () => {
    const resultados = [];
    const modelos = obtenerModelosIntegridad();

    for (const Modelo of modelos) {

        const nombreDVV = obtenerNombreDVV(Modelo);

        const resultado = await digitoVerificadorService.verificarTabla(
            Modelo,
            nombreDVV,
            Modelo.primaryKeyAttribute
        );

        resultados.push({tabla: Modelo.name,...resultado});
    }

    return {
        valido: resultados.every((resultado) => resultado.valido),

        tablas: resultados
    };
};


// INICIALIZAR UNA TABLA
const inicializarTabla = async ( Modelo, nombreDVV ) => {
    const idCampo = Modelo.primaryKeyAttribute;

    const registros =  await Modelo.findAll({ order: [[idCampo, "ASC"]] });


    // RECALCULAR TODOS LOS DVH
    for (const registro of registros) {

        const DVH = digitoVerificadorService.calcularDVH(registro);

        await Modelo.update(
            {
                DVH
            },
            {
                where: { [idCampo]: registro[idCampo]
                }
            }
        );
    }


    // RECALCULAR DVV
    // TAMBIÉN FUNCIONA SI LA TABLA ESTÁ VACÍA
    await digitoVerificadorService.recalcularTabla(
        Modelo,
        nombreDVV,
        idCampo
    );
};


// INICIALIZAR TODA LA INTEGRIDAD
const inicializarIntegridad = async () => {
    const modelos = obtenerModelosIntegridad();
    const tablas = [];

    for (const Modelo of modelos) {
        const nombreDVV = obtenerNombreDVV(Modelo);

        await inicializarTabla(
            Modelo,
            nombreDVV
        );

        tablas.push(Modelo.name);
    }

    return {
        success: true,
        tablas
    };
};


module.exports = {
    verificarIntegridad,
    inicializarIntegridad
};