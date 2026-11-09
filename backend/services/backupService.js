const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const {sequelize} = require("../config/database");

// ESCAPAR NOMBRE DE TABLA
const escaparTabla = (nombre) => {
    return `\`${String(nombre).replace(/`/g, "``")}\``;
};

// CONVERTIR REGISTRO A INSERT
const crearInsert = (tabla, registro) => {
    const campos = Object.keys(registro);
    const columnas = campos.map((campo) => escaparTabla(campo)).join(", ");
    const valores = campos.map((campo) => mysql.escape(registro[campo])).join(", ");

    return `INSERT INTO ${escaparTabla(tabla)} (${columnas}) VALUES (${valores});`;
};

// CREAR BACKUP
const crearBackup = async () => {
    const carpeta = path.join(__dirname, "../backups");

    if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta, {recursive: true});
    }

    const fecha = new Date().toISOString().replace(/[:.]/g, "-");
    const nombreArchivo = `backup-grwm-${fecha}.sql`;
    const ruta = path.join(carpeta, nombreArchivo);

    const [resultadoTablas] = await sequelize.query("SHOW TABLES");
    const tablas = resultadoTablas.map((fila) => Object.values(fila)[0]);

    let contenido = "";

    contenido += "-- BACKUP GRWM\n";
    contenido += `-- Fecha: ${new Date().toISOString()}\n\n`;
    contenido += "SET FOREIGN_KEY_CHECKS = 0;\n\n";

    for (const tabla of tablas) {
        const tablaEscapada = escaparTabla(tabla);

        // ESTRUCTURA
        const [estructura] = await sequelize.query(`SHOW CREATE TABLE ${tablaEscapada}`);
        const createTable = estructura[0]["Create Table"];

        contenido += `-- =============================\n`;
        contenido += `-- TABLA: ${tabla}\n`;
        contenido += `-- =============================\n\n`;

        contenido += `DROP TABLE IF EXISTS ${tablaEscapada};\n`;
        contenido += `${createTable};\n\n`;

        // DATOS
        const [registros] = await sequelize.query(`SELECT * FROM ${tablaEscapada}`);

        for (const registro of registros) {
            contenido += crearInsert(tabla, registro) + "\n";
        }

        contenido += "\n";
    }

    contenido += "SET FOREIGN_KEY_CHECKS = 1;\n";

    fs.writeFileSync(ruta, contenido, "utf8");

    return {
        ruta,
        nombreArchivo
    };
};

module.exports = {
    crearBackup
};