// IA TEMPORAL / MOCK
// Interpreta:
// - categorías
// - colores asociados a cada categoría
// - estilos básicos
// - prendas seleccionadas
// - evita repetir outfits cuando es posible
// Más adelante este archivo será reemplazado por IA real.

const normalizarTexto = (texto = "") => {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
};

// CATEGORÍAS Y SINÓNIMOS
const CATEGORIAS = {

    remeras: [
        "remera",
        "remeras",
        "parte de arriba",
        "partes de arriba",
        "prenda de arriba",
        "prendas de arriba",
        "superior",
        "superiores",
        "top",
        "tops",
        "camiseta",
        "camisetas",
        "shirt",
        "shirts",
        "blusa",
        "blusas"
    ],

    partes_abajo: [
        "parte de abajo",
        "partes de abajo",
        "prenda de abajo",
        "prendas de abajo",
        "pantalon",
        "pantalones",
        "jean",
        "jeans",
        "short",
        "shorts",
        "falda",
        "faldas"
    ],

    abrigos: [
        "abrigo",
        "abrigos",
        "campera",
        "camperas",
        "blazer",
        "blazers",
        "jacket",
        "jackets"
    ],

    zapatos: [
        "zapato",
        "zapatos",
        "zapatilla",
        "zapatillas",
        "calzado",
        "calzados",
        "bota",
        "botas",
        "sandalia",
        "sandalias",
        "shoe",
        "shoes",
        "sneaker",
        "sneakers"
    ],

    carteras: [
        "cartera",
        "carteras",
        "bolso",
        "bolsos",
        "bolsa",
        "bolsas",
        "mochila",
        "mochilas",
        "bag",
        "bags",
        "handbag",
        "handbags"
    ],

    accesorios: [
        "accesorio",
        "accesorios",
        "aro",
        "aros",
        "collar",
        "collares",
        "pulsera",
        "pulseras",
        "reloj",
        "relojes",
        "anteojo",
        "anteojos",
        "gafas",
        "sombrero",
        "sombreros",
        "watch",
        "watches",
        "sunglasses",
        "jewellery"
    ]
};

// COLORES
// Cada color tiene distintas formas posibles.
// También incluimos inglés porque DummyJSON puede traer
// nombres y descripciones en inglés.

const COLORES = {

    negro: [
        "negro",
        "negra",
        "negros",
        "negras",
        "black"
    ],

    blanco: [
        "blanco",
        "blanca",
        "blancos",
        "blancas",
        "white"
    ],

    rojo: [
        "rojo",
        "roja",
        "rojos",
        "rojas",
        "red"
    ],

    azul: [
        "azul",
        "azules",
        "blue",
        "navy"
    ],

    verde: [
        "verde",
        "verdes",
        "green"
    ],

    rosa: [
        "rosa",
        "rosado",
        "rosada",
        "rosados",
        "rosadas",
        "pink"
    ],

    violeta: [
        "violeta",
        "violetas",
        "morado",
        "morada",
        "purple"
    ],

    beige: [
        "beige",
        "crema",
        "cream"
    ],

    gris: [
        "gris",
        "grises",
        "gray",
        "grey"
    ],

    marron: [
        "marron",
        "marrones",
        "cafe",
        "brown"
    ],

    amarillo: [
        "amarillo",
        "amarilla",
        "amarillos",
        "amarillas",
        "yellow"
    ],

    naranja: [
        "naranja",
        "naranjas",
        "orange"
    ]
};

// DETECTAR COLOR EN UN TEXTO
const detectarColor = (texto) => {
    const textoNormalizado = normalizarTexto(texto);

    for (const [color, variantes] of Object.entries(COLORES)) {
        const encontrado = variantes.some((variante) => textoNormalizado.includes(normalizarTexto(variante)));
        
        if (encontrado) {
            return color;
        }
    }

    return null;
};


// =========================================================
// INTERPRETAR "CATEGORÍA + COLOR"
//
// Ejemplos:
//
// "zapatos negros"
//      → zapatos: negro
//
// "cartera beige"
//      → carteras: beige
//
// "quiero zapatillas blancas y cartera negra"
//      → zapatos: blanco
//      → carteras: negro
// =========================================================

const obtenerPreferenciasPorCategoria = (mensaje) => {
    const texto = normalizarTexto(mensaje);
    const preferencias = {};

    // Separamos frases para no mezclar el color
    // de una categoría con otra.
    const fragmentos = texto.split(/\s+y\s+|,|;|\./);

    for (const fragmento of fragmentos) {
        const color = detectarColor(fragmento);

        if (!color) {
            continue;
        }

        for (const [categoria, sinonimos] of Object.entries(CATEGORIAS)) {
            const mencionaCategoria = sinonimos.some((sinonimo) => fragmento.includes(normalizarTexto(sinonimo)));
            if (mencionaCategoria) {
                preferencias[categoria] = {color};
                break;
            }
        }
    }
    return preferencias;
};

// CLAVE ÚNICA DE PRENDA
const obtenerClavePrenda = (prenda) => {
    return `${prenda.origen}-${prenda.idOriginal ?? prenda.id}`;
};

// COLOR REAL / APARENTE DE UNA PRENDA
const obtenerColorPrenda = (prenda) => {
    const contenido = `
        ${prenda.color || ""}
        ${prenda.nombre || ""}
        ${prenda.descripcion || ""}
    `;

    return detectarColor(contenido);
};

// PUNTUAR PRENDA
const calcularPuntaje = (
    prenda,
    mensaje,
    preferencias
) => {
    let puntaje = 0;

    const contenido =
        normalizarTexto(`
            ${prenda.nombre || ""}
            ${prenda.categoria || ""}
            ${prenda.color || ""}
            ${prenda.descripcion || ""}
        `);

    // COLOR ASOCIADO A ESA CATEGORÍA
    const preferenciaCategoria = preferencias[prenda.categoria];

    if (preferenciaCategoria?.color) {
        const colorPedido = preferenciaCategoria.color;
        const colorPrenda = obtenerColorPrenda(prenda);

        if (colorPrenda === colorPedido) {
            // Coincidencia exacta:
            // tiene muchísimo peso.
            puntaje += 100;

        } else if (colorPrenda) {
            // Sabemos que tiene otro color.
            // Lo penalizamos fuerte.
            puntaje -= 100;
        }
    }

    // ESTILO
    const prompt = normalizarTexto(mensaje);

    if (prompt.includes("elegante") || prompt.includes("formal")) {

        const elegante = [
            "blazer",
            "formal",
            "classic",
            "elegant",
            "dress",
            "vestido",
            "heel",
            "handbag",
            "reloj",
            "watch"
        ];

        if (elegante.some((palabra) => contenido.includes(palabra))) {
            puntaje += 10;
        }
    }

    if (prompt.includes("casual")) {
        const casual = [
            "casual",
            "basic",
            "basica",
            "shirt",
            "remera",
            "top",
            "jean",
            "sneaker",
            "zapatilla"
        ];

        if (casual.some((palabra) => contenido.includes(palabra))) {
            puntaje += 10;
        }
    }

    if (prompt.includes("deportivo") || prompt.includes("deportiva")) {
        const deportivo = [
            "sport",
            "sports",
            "athletic",
            "running",
            "sneaker",
            "zapatilla"
        ];

        if (deportivo.some((palabra) => contenido.includes(palabra))) {
            puntaje += 10;
        }
    }

    return puntaje;
};

// ELEGIR PRENDA PARA UNA CATEGORÍA
const elegirPrenda = ({
    opciones,
    categoria,
    mensaje,
    preferencias,
    prendasEvitar
}) => {

    if (!opciones || opciones.length === 0) {
        return null;
    }

    let disponibles = opciones;

    // SI EL USUARIO PIDIÓ UN COLOR PARA ESTA CATEGORÍA,
    // SOLAMENTE ACEPTAMOS ESE COLOR
    const preferencia = preferencias[categoria];

    if (preferencia?.color) {
        const colorPedido = preferencia.color;
        const coincidenciasColor = disponibles.filter((prenda) => {
            const colorPrenda = obtenerColorPrenda(prenda);
            return (colorPrenda === colorPedido);
        });

        // Si existen prendas del color pedido,
        // descartamos completamente los demás colores.
        if (coincidenciasColor.length > 0) {
            disponibles = coincidenciasColor;
        } else {
            // No elegimos un color incorrecto.
            return null;
        }
    }

    // INTENTAR NO REPETIR EL OUTFIT ANTERIOR
    const sinRepetir = disponibles.filter((prenda) => !prendasEvitar.has(obtenerClavePrenda(prenda)));

    if (sinRepetir.length > 0) {
        disponibles = sinRepetir;
    }

    // PUNTUACIÓN
    const puntuadas = disponibles
        .map((prenda) => ({
            prenda,
            puntaje:
                calcularPuntaje(
                    prenda,
                    mensaje,
                    preferencias
                )
            })
        )
        .sort((a, b) =>  b.puntaje - a.puntaje);

    const mejorPuntaje = puntuadas[0]?.puntaje ?? 0;
    const mejores = puntuadas.filter((item) => item.puntaje === mejorPuntaje);
    const indice = Math.floor(Math.random() * mejores.length);

    return (
        mejores[indice]?.prenda ||
        null
    );
};

// GENERAR OUTFIT
const generarOutfit = async ({
    mensaje,
    temporada,
    categorias,
    candidatos,
    prendasSeleccionadas = [],
    prendasEvitar = []
}) => {
    const prendasElegidas = [];
    const idsUsados =new Set();
    const clavesAEvitar = new Set(prendasEvitar.map((prenda) => `${prenda.origen}-${prenda.id}`));

    // INTERPRETAR PROMPT
    const preferencias = obtenerPreferenciasPorCategoria(mensaje);
    console.log("Preferencias interpretadas:", preferencias);

    // Ejemplo:
    //
    // {
    //    zapatos: {
    //       color: "negro"
    //    },
    //
    //    carteras: {
    //       color: "beige"
    //    }
    // }

    // PRENDAS ELEGIDAS MANUALMENTE
    for (const prenda of prendasSeleccionadas ) {
        const clave = obtenerClavePrenda(prenda);

        if (!idsUsados.has(clave)) {
            prendasElegidas.push(prenda);
            idsUsados.add(clave);
        }
    }

    // COMPLETAR CATEGORÍAS
    for (const categoria of categorias) {
        const yaExiste = prendasElegidas.some((prenda) => prenda.categoria === categoria);

        if (yaExiste) {
            continue;
        }

        const opciones = candidatos.filter((prenda) => prenda.categoria === categoria && !idsUsados.has(obtenerClavePrenda(prenda)));

        if (opciones.length === 0) {
            continue;
        }

        const candidata =
            elegirPrenda({
                opciones,
                categoria,
                mensaje,
                preferencias,
                prendasEvitar: clavesAEvitar
            });

        if (candidata) {
            prendasElegidas.push(candidata);
            idsUsados.add(obtenerClavePrenda(candidata));
        }
    }

    return {
        titulo: "Outfit sugerido por GRWM",
        descripcion:
            `Creamos una combinación ${temporada.replace(
                "_",
                " "
            )} teniendo en cuenta: "${mensaje}".`,
        mensajeUsuario: mensaje,
        temporada,
        preferenciasInterpretadas: preferencias,
        prendas: prendasElegidas,
        razon: "GRWM relacionó los colores y características solicitadas con la categoría correspondiente.",
        mock: true
    };
};

module.exports = {generarOutfit};