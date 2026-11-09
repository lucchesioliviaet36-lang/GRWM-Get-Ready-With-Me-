const {sequelize} = require("../config/database");
const digitoVerificadorService = require("./digitoVerificadorService");

const verificarIntegridad = async () => {
    const resultados = [];

    const modelos = Object.values(sequelize.models).filter((Modelo) => {
        return Modelo.name !== "DVV" && Modelo.rawAttributes?.DVH && Modelo.primaryKeyAttribute;
    });

    for (const Modelo of modelos) {
        const resultado = await digitoVerificadorService.verificarTabla(
            Modelo,
            Modelo.name,
            Modelo.primaryKeyAttribute
        );

        resultados.push({
            tabla: Modelo.name,
            ...resultado
        });
    }

    return {
        valido: resultados.every((resultado) => resultado.valido),
        tablas: resultados
    };
};

module.exports = {verificarIntegridad};