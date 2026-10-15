const prendaService = require("./prendaService");
const catalgoService = require("./catalogoService");
const aiService = require("./iaService");
const Prenda = require("../models/prenda");

const categoriasValidas =[
    "remeras",
    "abrigos",
    "partes_abajo",
    "zapatos",
    "carteras",
    "accesorios"
];

const temporadas = [
    "veraniego",
    "media_estacion",
    "abrigado"
];

const modosValidos = [
    "armario",
    "catalogo",
    "mixto"
];

const normalizarPrendaArmario = (prenda) => {

    const datos = typeof prenda.toJSON === "function" ? prenda.toJSON() : prenda;

    return{
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
        descripcion: producto.descripcion || null,
        imagen: producto.imagen_url || null
    };
};

const validarCategorias = (categorias) => {

    if(!Array.isArray(categorias)) {
        throw new Error(
            "Las categorias debem enviarse como un array"
        );
    }

    const invalidas = categorias.filter((categoria) => !categoriasValidas.includes(categoria));

    if (invalidas.length > 0) {
        throw new Error ( `Categorías inválidas: ${invalidas.join(", ")}`);
    }

};

const obtenerPrendasArmario = async( idUsuario, categorias) => {
    const prendas = await prendaService.obtenerArmario(idUsuario);
    const normalizadas = prendas.map(normalizarPrendaArmario);

    if (!categorias || categorias.length === 0) {
        return normalizadas;
    }

    return normalizadas.filter((prenda) =>
    categorias.includes(prenda.categoria));
};

const obtenerPrendasCatalogo = async(categorias) =>{
    const resultados = [];

    for (const categoria of categorias) {
        try{
            const productos = await catalgoService.obtenerParaGRWM(categoria);
            const normalizados = productos.map((producto) => normalizarPrendaCatalogo(producto,categoria));

            resultados.push(...normalizados);
        }
        catch(error) {
            console.error(`Error obteniendo catálogo de ${categoria}:`,
                error.message);
        }
    }

    return resultados;
};

const eliminarDuplicados = (prendas) => {
    const vistos = new set();

    return prendas.filter((prenda) => {

        const clave = `${prenda.origen}-${prenda.idOriginal}`;

        if (vistos.has(clave)) {
            return false;
        }

        vistos.add(clave);

        return true;
    });
};

const obtenerCandidatos = async ({
    idUsuario,
    categorias = categoriasValidas,
    modo = "mixto",
    busqueda = ""
}) => {

    validarCategorias(categorias);

    if (!modosValidos.includes(modo)) {
        throw new Error (
            "Modo invalido.Seleccione el modo armario, catalogo o mixto"
        );
    }

    let prendasArmario = [];
    let prendasCatalogo =[];

    if (modo === "armario" || modo === "mixto" ){
        prendasArmario = await obtenerPrendasArmario
    }
}