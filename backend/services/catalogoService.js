const URL = "https://dummyjson.com/products";

const asignacionCategoria ={
  remeras: ["tops"],
  zapatos: ["womens-shoes"],
  carteras: ["womens-bags"],
  accesorios: [
    "womens-jewellery",
    "sunglasses",
    "womens-watches"
    ]
};

const obtenerPorCategoria = async (categoria) => {
    const response = await fetch(`${URL}/category/${encodeURIComponent(categoria)}`);

    if (!response.ok) {
        throw new Error("No se pudo acceder al catalogo");
    }

    const data = await response.json();

    return data.products.map((producto) => ({
        idExterno: producto.id,
        nombre: producto.title,
        descripcion: producto.description,
        categoria: producto.category,
        imagen: producto.thumbnail,
        imagenes: producto.images,
        origen: "catalogo_externo"
    })); 

};

const obtenerParaGRWM = async (categoriasInternas) => {
    const categoriasExternas = asignacionCategoria[categoriasInternas];

    if (!categoriasExternas){
        return[];
    }

    const resultados = [];
        
    for (const categoria of categoriasExternas) {
        const productos = await obtenerPorCategoria(categoria);
        resultados.push(...productos);
    }

    return resultados;
};

module.exports = { obtenerPorCategoria, obtenerParaGRWM};