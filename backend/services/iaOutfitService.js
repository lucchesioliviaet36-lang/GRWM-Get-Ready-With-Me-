const prendaService = require("./prendaService");
const catalogoService = require("./catalogoService");
const aiService = require("./iaService");

const CATEGORIAS_VALIDAS = [
    "remeras",
    "abrigos",
    "partes_abajo",
    "zapatos",
    "carteras",
    "accesorios"
];

const TEMPORADAS_VALIDAS = [
    "veraniego",
    "media_estacion",
    "abrigado"
];

const MODOS_VALIDOS = [
    "armario",
    "catalogo",
    "mixto"
];

const normalizarPrendaArmario = (prenda) => {

    const datos = typeof prenda.toJSON === "function" ? prenda.toJSON() : prenda;

    return {
        id: datos.id_prenda,
        idOriginal: datos.id_prenda,
        origen: "armario",
        nombre: datos.nombre,
        categoria: datos.categoria,
        color: datos.color || null,
        descripcion: datos.descripcion || null,
        imagen: datos.imagen_url || null
    };
};

const normalizarPrendaCatalogo = (producto, categoriaInterna) => {

    return {
        id: producto.idExterno,
        idOriginal: producto.idExterno,
        origen: "catalogo",
        nombre: producto.nombre,
        categoria: categoriaInterna,
        color: producto.color || null,
        descripcion:producto.descripcion || null,
        imagen:producto.imagen || null
    };
};

const validarCategorias = (categorias) => {

    if (!Array.isArray(categorias)) {
        throw new Error("Las categorías deben enviarse como un array");
    }

    const invalidas = categorias.filter((categoria) => !CATEGORIAS_VALIDAS.includes(categoria));

    if (invalidas.length > 0) {
        throw new Error(`Categorías inválidas: ${invalidas.join(", ")}`);
    }
};

const obtenerPrendasArmario = async ( idUsuario, categorias) => {
    const prendas = await prendaService.obtenerArmario(idUsuario);
    const normalizadas = prendas.map(normalizarPrendaArmario);

    if (!categorias || categorias.length === 0) {
        return normalizadas;
    }

    return normalizadas.filter((prenda) => categorias.includes(prenda.categoria));
};

const obtenerPrendasCatalogo = async (categorias) => {
    const resultados = [];
    for (const categoria of categorias) {

        try {

            const productos = await catalogoService.obtenerParaGRWM(categoria);
            const normalizados = productos.map((producto) => normalizarPrendaCatalogo(producto, categoria));

            resultados.push(...normalizados);

        } catch (error) {

            console.error(
                `Error obteniendo catálogo de ${categoria}:`,
                error.message
            );

        }
    }

    return resultados;
};

const eliminarDuplicados = (prendas) => {
    const vistos = new Set();

    return prendas.filter((prenda) => {
        const clave = `${prenda.origen}-${prenda.idOriginal}`;

        if (vistos.has(clave)) {
            return false;
        }

        vistos.add(clave);

        return true;
    });
};

// OBTENER TODAS LAS PRENDAS DISPONIBLES
const obtenerCandidatos = async ({
    idUsuario,
    categorias = CATEGORIAS_VALIDAS,
    modo = "mixto",
    busqueda = ""
}) => {

    validarCategorias(categorias);

    if (!MODOS_VALIDOS.includes(modo)) {
        throw new Error("Modo inválido. Use armario, catalogo o mixto");
    }


    let prendasArmario = [];
    let prendasCatalogo = [];

    // MI ARMARIO
    if ( modo === "armario" || modo === "mixto") {
        prendasArmario = await obtenerPrendasArmario(idUsuario, categorias);
    }

    // CATÁLOGO
    if (modo === "catalogo" || modo === "mixto" ) {
        prendasCatalogo = await obtenerPrendasCatalogo(categorias);
    }

    let candidatos = eliminarDuplicados([...prendasArmario, ...prendasCatalogo]);

     if (busqueda.trim() !== "") {
        const texto = busqueda.toLowerCase().trim();

        candidatos = candidatos.filter((prenda) => {
            const contenido = `
                ${prenda.nombre || ""}
                ${prenda.categoria || ""}
                ${prenda.color || ""}
                ${prenda.descripcion || ""}
            `.toLowerCase();


            return contenido.includes(texto);
        });
    }

    return candidatos;
};

// GENERAR OUTFIT
const generarOutfit = async ({
    idUsuario,
    mensaje,
    temporada,
    categorias,
    modo = "mixto",
    prendasSeleccionadas = [],
    prendasEvitar = []
}) => {

    // VALIDACIONES
    if (!mensaje || mensaje.trim() === "") {
        throw new Error("Debe escribir qué tipo de outfit está buscando");
    }

    if (!Array.isArray(categorias) || categorias.length === 0) {
        throw new Error("Debe seleccionar al menos una categoría");
    }

    validarCategorias(categorias);

    if (!TEMPORADAS_VALIDAS.includes(temporada)) {
        throw new Error("Temporada inválida");
    }

    if (!MODOS_VALIDOS.includes(modo)) {
        throw new Error("Modo inválido");
    }

    // BUSCAR PRENDAS
    const candidatos = await obtenerCandidatos({idUsuario, categorias, modo});

    if (candidatos.length === 0) {
        throw new Error("No se encontraron prendas disponibles");
    }

    // VERIFICAR PRENDAS SELECCIONADAS
    const seleccionadasValidas = [];

    for (const seleccionada of prendasSeleccionadas) {

        const encontrada = candidatos.find((prenda) =>
            String(prenda.idOriginal) === String(seleccionada.id) && prenda.origen === seleccionada.origen );

        if (encontrada) {
            seleccionadasValidas.push(encontrada);
        }
    }

    // LLAMAR SERVICIO IA
    const outfit =
        await aiService.generarOutfit({
            mensaje,
            temporada,
            categorias,
            candidatos,
            prendasSeleccionadas: seleccionadasValidas,
            prendasEvitar
        });

        return outfit;
};


module.exports = { obtenerCandidatos, generarOutfit };